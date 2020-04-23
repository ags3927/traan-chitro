const activityRepository = require('./../db/repository/activityRepository.js');
const activityInterface = require('./../db/interfaces/activityInterface.js');

/**
 * Handles the GET request for all pins within bounds, optionally filtered
 * @param req
 * @param res
 * @returns {Promise<[{lat, lng}]>} - Returns an array of latitude, longitude pairs
 */
const handleGETPins = async (req, res) => {
    try {
        let query = req.query;
        let bounds = JSON.parse(query.bounds);
        let filter = JSON.parse(query.filter);
        let result = await activityInterface.findActivitiesByBoundsAndFilters(bounds, filter);
        return res.status(200).send({
            locations: result
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("ERROR in GET /api/pins\\Could not get pins");
    }
};

/**
 * Handles the GET request for all activities at a coordinate,
 * @param req
 * @param res
 * @returns {Promise<[Activity]>} - Returns an array of Activity objects, attributes filtered based on privilege
 */
const handleGETActivitiesByCoordinates = async (req, res) => {
    try {
        let body = req.body;
        let result;
        if (body.privileged) {
            result = await activityInterface.findActivitiesByCoordinatesPrivileged(body.location, body.filter);
        } else {
            result = await activityInterface.findActivitiesByCoordinatesUnprivileged(body.location, body.filter);
        }
        return res.status(200).send(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("ERROR in GET /api/pins\\Could not get activities");
    }
};


module.exports = {handleGETPins, handleGETActivitiesByCoordinates};