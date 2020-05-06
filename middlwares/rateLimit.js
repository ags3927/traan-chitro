let {RateLimiterMemory} = require('rate-limiter-flexible');

const maxWrongAttemptsByIPPerDay = 10;
const maxRequestsByIPPerDay = 10000; // this enables one to send 5 req/second for 33 minutes :/
const maxSuccessfulRegAttemptByIPPerDay = 5;
const maxFailedRegAttemptByIPPerDay = 20;

const optsPrivileged = {
    keyPrefix: 'privileged',
    points: 5, // 5 points. Each request consumes 1 point.
    duration: 1, // Per second
};

const optsUnprivileged = {
    keyPrefix: 'unprivileged',
    points: 5, // 5 points. Each request consumes 1 point.
    duration: 1, // Per second
};

const optsSlowBruteByIP = {
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPPerDay,
    duration: 60 * 60,
    blockDuration: 60 * 60 * 24 // Block for 1 day if 10 wrong attempts in an hour
}

const optsMaxRequestsByIP = {
    keyPrefix: 'rquest_by_ip_per_day',
    points: maxRequestsByIPPerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24 * 365
}

const optsMaxSuccessfulRegAttemptsByIP = {
    keyPrefix: 'successful_reg_attempts_by_ip_per_day',
    points: maxSuccessfulRegAttemptByIPPerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24
}

const optsMaxFailedRegAttemptsByIP = {
    keyPrefix: 'failed_reg_attempts_by_ip_per_day',
    points: maxFailedRegAttemptByIPPerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24
}

const rateLimiterPrivileged = new RateLimiterMemory(optsPrivileged);
const rateLimiterUnprivileged = new RateLimiterMemory(optsUnprivileged);
const rateLimitSlowBruteByIP = new RateLimiterMemory(optsSlowBruteByIP);
const rateLimitMaxRequestsByIP = new RateLimiterMemory(optsMaxRequestsByIP);
const rateLimitMaxSuccessfulRegAttemptsByIP = new RateLimiterMemory(optsMaxSuccessfulRegAttemptsByIP);
const rateLimitMaxFailedRegAttemptsByIP = new RateLimiterMemory(optsMaxFailedRegAttemptsByIP);

const IsIPBlocked = async (ips) => {
    let resSlowBruteByIP;
    let resMaxRequestsByIP;
    let resMaxSuccessfulRegAttemptsByIP;
    let resMaxFailedRegAttemptsByIP;
    let [retryAfterSeconds, isBlocked] = [0, false];
    for (const ip of ips) {

        console.log("IP Address = ", ip);

        resSlowBruteByIP = await rateLimitSlowBruteByIP.get(ip);
        resMaxRequestsByIP = await rateLimitMaxRequestsByIP.get(ip);
        resMaxSuccessfulRegAttemptsByIP = await rateLimitMaxSuccessfulRegAttemptsByIP.get(ip);
        resMaxFailedRegAttemptsByIP = await rateLimitMaxFailedRegAttemptsByIP.get(ip);

        if (resSlowBruteByIP !== null && resSlowBruteByIP.consumedPoints > maxWrongAttemptsByIPPerDay) {
            retryAfterSeconds = Math.round(resSlowBruteByIP.msBeforeNext / 1000) || 1;
            isBlocked = true;
        } else if (resMaxSuccessfulRegAttemptsByIP !== null && resMaxSuccessfulRegAttemptsByIP.consumedPoints > maxSuccessfulRegAttemptByIPPerDay) {
            retryAfterSeconds = Math.round(resMaxSuccessfulRegAttemptsByIP.msBeforeNext / 1000) || 1;
            isBlocked = true;
        } else if (resMaxFailedRegAttemptsByIP !== null && resMaxFailedRegAttemptsByIP.consumedPoints > maxFailedRegAttemptByIPPerDay) {
            retryAfterSeconds = Math.round(resMaxFailedRegAttemptsByIP.msBeforeNext / 1000) || 1;
            isBlocked = true;
        } else if (resMaxRequestsByIP !== null && resMaxRequestsByIP.consumedPoints > maxRequestsByIPPerDay) {
            retryAfterSeconds = Math.round(resMaxRequestsByIP.msBeforeNext / 1000) || 1;
            isBlocked = true;
        }
        if (isBlocked) {
            break;
        }
    }
    return {
        retryAfterSeconds,
        isBlocked
    };
};

const consumeIPs = async (ips, consumer) => {
    try {
        for (const ip of ips) {
            await consumer.consume(ip);
        }
        return {
            consumed: true,
            errorObject: null
        };
    } catch (rejRes) {
        return {
            consumed: false,
            errorObject: rejRes
        };
    }
}

const rateLimiterMiddlewareInMemoryWithAuthChecking = async (req, res, next) => {
    try {
        let privileged = (res.locals.middlewareResponse.status === 'OK');
        let results;
        if (privileged) {

            results = await consumeIPs(res.locals.ips, rateLimiterPrivileged);
        } else {

            results = await consumeIPs(res.locals.ips, rateLimiterUnprivileged);
        }
        //next();
        if (results.consumed) {
            next();
        } else {
            if (results.errorObject instanceof Error) {
                res.status(500).send({
                    message: 'Error in rate limiting middleware'
                });
            } else {
                res.status(429).send({
                    message: 'Too Many Requests'
                });
            }
        }
    } catch (e) {
        res.status(500).send({
            message: 'Error in rate limiting middleware'
        });
    }
};

const rateLimiterMiddlewareBefore = async (req, res, next) => {
    try {
        let checkedResult = await IsIPBlocked(res.locals.ips);
        let results;
        if (!checkedResult.isBlocked) {

            results = await consumeIPs(res.locals.ips, rateLimitMaxRequestsByIP);
            if (results.consumed) {
                next();
            } else {
                if (results.errorObject instanceof Error) {
                    res.status(500).send({
                        message: 'Error in rate limiting middleware'
                    });
                } else {
                    let rejRetryAfterSeconds = Math.round(results.errorObject.msBeforeNext / 1000) || 1;
                    res.status(429).send({
                        message: `Too Many Requests`
                    });
                }
            }
        } else {
            res.status(429).send({
                message: `Too Many Requests`
            });
        }
    } catch (e) {

        res.status(500).send({
            message: 'Error in rate limiting middleware'
        });
    }
};

const rateLimiterMiddlewareAfter = async (req, res) => {
    try {

        let results;
        let resSlowBruteByIP;
        if (res.locals.middlewareResponse.consume) {

            results = await consumeIPs(res.locals.ips, rateLimitSlowBruteByIP);
            if (results.consumed) {
                res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
            } else {
                if (results.errorObject instanceof Error) {
                    res.status(500).send({
                        message: 'Error in rate limiting middleware'
                    });
                } else {
                    let rejRetryAfterSeconds = Math.round(results.errorObject.msBeforeNext / 1000) || 1;
                    res.status(429).send({
                        message: `Too Many Requests\nRetry after ${rejRetryAfterSeconds} second(s)`
                    });
                }
            }

        } else {
            for (const ip of res.locals.ips) {
                resSlowBruteByIP = await rateLimitSlowBruteByIP.get(ip);
                if (resSlowBruteByIP !== null && resSlowBruteByIP.consumedPoints > 0) {
                    await rateLimitSlowBruteByIP.delete(ip);
                }
            }
            res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
        }
    } catch (e) {

        res.status(500).send({
            message: 'Error in rate limiting middleware'
        });
    }
};

const rateLimiterMiddlewareRegister = async (req, res) => {
    try {
        let results;
        if (res.locals.middlewareResponse.inserted) {

            results = await consumeIPs(res.locals.ips, rateLimitMaxSuccessfulRegAttemptsByIP);
        } else {

            results = await consumeIPs(res.locals.ips, rateLimitMaxFailedRegAttemptsByIP);
        }

        if (results.consumed) {
            res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
        } else {
            if (results.errorObject instanceof Error) {
                res.status(500).send({
                    message: 'Error in rate limiting middleware'
                });
            } else {
                if (results.errorObject instanceof Error) {
                    res.status(500).send({
                        message: 'Error in rate limiting middleware'
                    });
                } else {
                    let rejRetryAfterSeconds = Math.round(results.errorObject.msBeforeNext / 1000) || 1;
                    res.status(429).send({
                        message: `Too Many Requests`
                    });
                }
            }
        }

    } catch (e) {

        res.status(500).send({
            message: 'Error in rate limiting middleware'
        });
    }
};

module.exports = {
    rateLimiterMiddlewareInMemoryWithAuthChecking,
    rateLimiterMiddlewareBefore,
    rateLimiterMiddlewareAfter,
    rateLimiterMiddlewareRegister
}