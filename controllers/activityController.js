const activityRepository = require('./../db/repository/activityRepository.js');
const activityInterface = require('./../db/interfaces/activityInterface.js');

const handleGETPins = async (req, res) => {
    let body = req.body;
    return await activityInterface.findActivitiesByBounds(body.bounds, body.filter);
};

module.exports = {handleGETPins};