const _ = require('lodash');
const findClientIP = (req, res, next) => {
    let ipArray = req.header('X-Forwarded-For').split(',');
    let consumableIPs = ipArray.filter(ip => {
        if (!(ip.startsWith('172.') || ip.startsWith('169.') || ip.startsWith('192.') || ip.startsWith('10.'))){
            return ip;
        }
    });

    res.locals.ips = consumableIPs;
    next();
}

module.exports = {
    findClientIP
};