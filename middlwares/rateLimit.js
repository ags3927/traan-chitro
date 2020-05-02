let {RateLimiterMemory} = require('rate-limiter-flexible');

const maxWrongAttemptsByIPPerDay = 10;

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

const rateLimiterPrivileged = new RateLimiterMemory(optsPrivileged);
const rateLimiterUnprivileged = new RateLimiterMemory(optsUnprivileged);
const rateLimitSlowBruteByIP = new RateLimiterMemory(optsSlowBruteByIP);


const IsIPBlocked = async (ip) => {
    let resSlowBruteByIP = await rateLimitSlowBruteByIP.get(ip);

    let [retryAfterSeconds, isBlocked] = [0, false];

    if (resSlowBruteByIP !== null && resSlowBruteByIP.consumedPoints > maxWrongAttemptsByIPPerDay) {
        retryAfterSeconds = Math.round(resSlowBruteByIP.msBeforeNext / 1000) || 1;
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

const preHandlerRateLimiter = async (req, res, next) => {
    try {
        let checkedResult = await IsIPBlocked(req.ip);
        if (!checkedResult.isBlocked) {
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

const postHandlerRateLimiter = async (req, res) => {
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


module.exports = {
    rateLimiterMiddlewareInMemoryWithAuthChecking,
    preHandlerRateLimiter,
    postHandlerRateLimiter,
}