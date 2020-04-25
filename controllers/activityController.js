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

        let privileged = (res.locals.middlewareResponse.status === 'OK');
        let result;

        if (privileged) {
            result = await activityInterface.findActivitiesByBoundsAndFiltersPrivileged(bounds, filter);
        } else {
            result = await activityInterface.findActivitiesByBoundsAndFiltersUnprivileged(bounds, filter);
        }
        return res.status(200).send({
            locations: result.data
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: "ERROR in GET /api/pins\\Could not get pins",
            error: e.message
        });
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
        let query = req.query;

        let location = JSON.parse(query.location);
        let filter = JSON.parse(query.filter);

        let result;
        let privileged =  (res.locals.middlewareResponse.status === 'OK');

        if (privileged) {
            result = await activityInterface.findActivitiesByCoordinatesAndFiltersPrivileged(location, filter);
        } else {
            result = await activityInterface.findActivitiesByCoordinatesAndFiltersUnprivileged(location, filter);
        }
        return res.status(200).send({
            activities: result.data
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: "ERROR in GET /api/activities\\Could not get activities",
            error: e.message
        });
    }
};


const handlePOSTActivity = async (req, res) => {
    try {
        let body = req.body;
        let privileged =  (res.locals.middlewareResponse.status === 'OK');
        let result;
        if (privileged) {
            let data = {
                orgName: res.locals.middlewareResponse.user.orgName,
                typeOfRelief: body.typeOfRelief,
                location: body.location,
                contents: body.contents,
                supplyDate: new Date(body.supplyDate)
            };
            result = await activityInterface.createActivityAndInsert(data);
        }
        else {
            return res.status(500).send({
                message: "ERROR in POST /api/activity\\Could not insert activity",
                error: "User not authenticated for this action"
            });
        }
        res.status(200).send(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: "ERROR in POST /api/activity\\Could not insert activity",
            error: e.message
        });
    }
};


module.exports = {
    handleGETPins,
    handleGETActivitiesByCoordinates,
    handlePOSTActivity
};