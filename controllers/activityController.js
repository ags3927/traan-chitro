const activityRepository = require('./../db/repository/activityRepository.js');

const handleGETPins = async (req, res) => {
    let bounds = req.bounds;

    let activityArray = activityRepository.findActivitiesByBounds(bounds.southwest, bounds.northeast);



};