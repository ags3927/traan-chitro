const activityRepository = require('./../db/repository/activityRepository.js');
const activityInterface = require('./../db/interfaces/activityInterface.js');

/**
 * Handles the GET request for all pins within bounds, optionally filtered based on certain criteria
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const handleGETPins = async (req, res) => {
    try {
        let body = req.body;
        let result = await activityInterface.findActivitiesByBounds(body.bounds, body.filter);
        return res.status(200).send(result);
    } catch (e) {
        console.log("ERROR in GET /api/pins\\Could not get pins");
        return res.status(500).send(e.message);
    }
};

module.exports = {handleGETPins};