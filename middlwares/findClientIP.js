const _ = require('lodash');

const ipExtractionMiddleware = (req, res, next) => {
    let ipArray = req.header('X-Forwarded-For').split(',');

    console.log("IP Array in middleware:\n", ipArray);

    res.locals.ips = ipArray.filter(ip => {
        ip = ip.trim();
        if (!(ip.startsWith('172.')
            || ip.startsWith('169.')
            || ip.startsWith('192.')
            || ip.startsWith('10.')
            || ip.startsWith('127.'))) {
            return ip;
        }
    });

    console.log("Filtered IP Array in middleware:\n", res.locals.ips);

    next();
}

module.exports = {
    ipExtractionMiddleware
};