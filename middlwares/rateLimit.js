let {RateLimiterMemory} = require('rate-limiter-flexible');

const maxWrongAttemptsByIPPerDay = 2;
const maxRequestsByIPPerDay = 10; // this enables one to send 5 req/second for 33 minutes :/
const maxSuccessfulRegAttemptByIPPerDay = 2;
const maxFailedRegAttemptByIPPerDay = 3;

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
    keyPrefix: 'request_by_ip_per_day',
    points: maxRequestsByIPPerDay,
    duration: 60*60*24,
    blockDuration: 60*60*24*365
}

const optsMaxSuccessfulRegAttemptsByIP = {
    keyPrefix: 'successful_reg_attempts_by_ip_per_day',
    points: maxSuccessfulRegAttemptByIPPerDay,
    duration: 60*60*24,
    blockDuration: 60*60*24
}

const optsMaxFailedRegAttemptsByIP = {
    keyPrefix: 'failed_reg_attempts_by_ip_per_day',
    points: maxFailedRegAttemptByIPPerDay,
    duration: 60*60*24,
    blockDuration: 60*60*24
}


const rateLimiterPrivileged = new RateLimiterMemory(optsPrivileged);
const rateLimiterUnprivileged = new RateLimiterMemory(optsUnprivileged);
const rateLimitSlowBruteByIP = new RateLimiterMemory(optsSlowBruteByIP);
const rateLimitMaxRequestsByIP = new RateLimiterMemory(optsMaxRequestsByIP);
const rateLimitMaxSuccessfulRegAttemptsByIP = new RateLimiterMemory(optsMaxSuccessfulRegAttemptsByIP);
const rateLimitMaxFailedRegAttemptsByIP = new RateLimiterMemory(optsMaxFailedRegAttemptsByIP);


const IsIPBlocked = async (ip) => {
    let resSlowBruteByIP = await rateLimitSlowBruteByIP.get(ip);
    let resMaxRequestsByIP = await rateLimitMaxRequestsByIP.get(ip);
    let resMaxSuccessfulRegAttemptsByIP = await rateLimitMaxSuccessfulRegAttemptsByIP.get(ip);
    let resMaxFailedRegAttemptsByIP = await rateLimitMaxFailedRegAttemptsByIP.get(ip);

    let [retryAfterSeconds, isBlocked] = [0, false];

    if (resSlowBruteByIP !== null && resSlowBruteByIP.consumedPoints > maxWrongAttemptsByIPPerDay) {

        console.log('Slow Brute = ', rateLimitSlowBruteByIP.getKey(ip));

        retryAfterSeconds = Math.round(resSlowBruteByIP.msBeforeNext / 1000) || 1;
        isBlocked = true;

    } else if (resMaxSuccessfulRegAttemptsByIP !== null && resMaxSuccessfulRegAttemptsByIP.consumedPoints > maxSuccessfulRegAttemptByIPPerDay) {

        console.log('Reg Success = ', rateLimitMaxSuccessfulRegAttemptsByIP.getKey(ip));

        retryAfterSeconds = Math.round(resMaxSuccessfulRegAttemptsByIP.msBeforeNext / 1000) || 1;
        isBlocked = true;

    } else if (resMaxFailedRegAttemptsByIP !== null && resMaxFailedRegAttemptsByIP.consumedPoints > maxFailedRegAttemptByIPPerDay) {

        console.log('Reg Fail = ', rateLimitMaxFailedRegAttemptsByIP.getKey(ip));

        retryAfterSeconds = Math.round(resMaxFailedRegAttemptsByIP.msBeforeNext / 1000) || 1;
        isBlocked = true;

    } else if (resMaxRequestsByIP !== null && resMaxRequestsByIP.consumedPoints > maxRequestsByIPPerDay) {

        console.log('Max Req = ', rateLimitMaxRequestsByIP.getKey(ip));

        retryAfterSeconds = Math.round(resMaxRequestsByIP.msBeforeNext / 1000) || 1;
        isBlocked = true;
    }

    return {
        retryAfterSeconds,
        isBlocked
    };
};

const rateLimiterMiddlewareInMemoryWithAuthChecking = async (req, res, next) => {
    let privileged = (res.locals.middlewareResponse.status === 'OK');
    try {
        if (privileged) {
            await rateLimiterPrivileged.consume(req.ip);
        } else {
            await rateLimiterUnprivileged.consume(req.ip);
        }
        next();
    } catch (rejRes) {
        if (rejRes instanceof Error) {
            ////next(rejRes);
            return res.status(500).send({
                message: 'Error in rate limiting middleware'
            });
        } else {
            console.error('ERROR: Too many request coming in from IP. HTTP: 429');
            return res.status(429).send({
                message: 'Too Many Requests'
            });
        }
    }
};

const rateLimiterMiddlewareBefore = async (req, res, next) => {
    try {
        let checkedResult = await IsIPBlocked(req.ip);
        if (!checkedResult.isBlocked) {
            await rateLimitMaxRequestsByIP.consume(req.ip);
            next();
        } else {
            res.status(429).send({
                message: `Too Many Requests\nRetry after ${checkedResult.retryAfterSeconds} second(s)`
            });
        }
    } catch (rejRes) {
        if (rejRes instanceof Error) {
            res.status(500).send(rejRes.message);
        } else {
            let rejRetryAfterSeconds = Math.round(rejRes.msBeforeNext / 1000) || 1;
            res.status(429).send({
                message: `Too Many Requests\nRetry after ${rejRetryAfterSeconds} second(s)`
            });
        }
    }
};

const rateLimiterMiddlewareAfter = async (req, res) => {
    try {
        let resSlowBruteByIP = await rateLimitSlowBruteByIP.get(req.ip);
        if (res.locals.middlewareResponse.consume) {
            await rateLimitSlowBruteByIP.consume(req.ip);
            res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
        } else {
            if (resSlowBruteByIP !== null && resSlowBruteByIP.consumedPoints > 0) {
                await rateLimitSlowBruteByIP.delete(req.ip);
            }
            res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
        }
    } catch (rejRes) {
        if (rejRes instanceof Error) {
            res.status(500).send(rejRes.message);
        } else {
            let rejRetryAfterSeconds = Math.round(rejRes.msBeforeNext / 1000) || 1;
            res.status(429).send({
                message: `Too Many Requests\nRetry after ${rejRetryAfterSeconds} second(s)`
            });
        }
    }
};

const rateLimiterMiddlewareRegister = async (req, res) => {
    try {
        if (res.locals.middlewareResponse.inserted) {
            await rateLimitMaxSuccessfulRegAttemptsByIP.consume(req.ip);
        } else {
            await rateLimitMaxFailedRegAttemptsByIP.consume(req.ip);
        }
        res.status(res.locals.middlewareResponse.responseStatus).send(res.locals.middlewareResponse.responseObject);
    } catch (rejRes) {
        if (rejRes instanceof Error) {
            res.status(500).send(rejRes.message);
        } else {
            let rejRetryAfterSeconds = Math.round(rejRes.msBeforeNext / 1000) || 1;
            res.status(429).send({
                message: `Too Many Requests\nRetry after ${rejRetryAfterSeconds} second(s)`
            });
        }
    }
};

module.exports = {
    rateLimiterMiddlewareInMemoryWithAuthChecking,
    rateLimiterMiddlewareBefore,
    rateLimiterMiddlewareAfter,
    rateLimiterMiddlewareRegister
}