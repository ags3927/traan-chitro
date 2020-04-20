const mongoose = require("mongoose");
const _ = require("lodash");
const moment = require("moment");

const { Activity } = require("../models/activity");
const ObjectId = mongoose.Types.ObjectId;

const reliefTypes = ["FOOD", "PPE", "MASK", "SANITIZER", "GLOVE"];


const insertActivity = async (activityObject) => {
    let activity = new Activity({
        orgName: activityObject.orgName,
        location: activityObject.location,
    });

    try {
        return await Activity.collection.insertOne(activity);
    } catch (e) {
        return null;
    }
};

const insertActivities = async (activityObjectArray) => {
    try {
        return await Activity.collection.insertMany(activityObjectArray, {
            ordered: false,
        });
    } catch (e) {
        return null;
    }
};

const deleteActivity = async (id) => {
    try {
        return await Activity.collection.deleteOne({ _id: ObjectId(id) });
    } catch (e) {
        return null;
    }
};

const deleteActivities = async (orgName) => {
    try {
        return await Activity.collection.deleteMany({ orgName: orgName });
    } catch (e) {
        return null;
    }
};

const editActivity = async (id, activityObject) => {
    try {
        return await Activity.collection.replaceOne({
            _id: ObjectId(id)
        }, activityObject);
    } catch (e) {
        return null;
    }
};

const editActivities = async (prevOrgName, updatedOrgName) => {
    try {
        return await Activity.updateMany({
            orgName: prevOrgName
        }, {
            $set: {
                orgName: updatedOrgName
            }
        });
    } catch (e) {
        return null;
    }
};

const resolveScheduleAndFilterByBoundsWithoutOrganization = async (bounds, filter) => {
    if (filter.schedule === "PAST") {
        let locations = await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            location: {
                $geoWithin: {
                    $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        }, {
            _id: 0,
            "location.coordinates": 1
        });

    return _.map(locations, (element) => {
        return {
            lat: element.location.coordinates[1],
            lng: element.location.coordinates[0],
        };
    });
    } else {
        let locations = await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            location: {
                $geoWithin: {
                    $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        }, {
            _id: 0,
            "location.coordinates": 1
        });

        return _.map(locations, (element) => {
            return {
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0],
            };
        });
    }
};

const resolveScheduleAndFilterByBoundsWithOrganization = async (bounds, filter) => {

    if (filter.schedule === "PAST") {
        let locations = await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            location: {
                $geoWithin: {
                 $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        }, {
            _id: 0,
            "location.coordinates": 1
        });

        return _.map(locations, (element) => {
            return {
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0],
            };
        });
    } else {
        let locations = await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            location: {
                $geoWithin: {
                $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        }, {
            _id: 0,
            "location.coordinates": 1
        });

        return _.map(locations, (element) => {
            return {
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0],
            };
        });
    }
};

const resolveScheduleAndFilterByCoordinatesWithoutOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });

    } else {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });
    }
};

const resolveScheduleAndFilterByCoordinatesWithOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });

    } else {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });
    }
};

const resolveScheduleAndFilterByCoordinatesWithoutOrganizationUnprivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });

    } else {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });
    }
};

const resolveScheduleAndFilterByCoordinatesWithOrganizationUnprivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $lt: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });

    } else {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            deliveryDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });
    }
};

const findActivitiesByBounds = async (bounds, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
        filter.typeOfRelief = reliefTypes;
        }

        if (filter.orgName === null) {
            return await resolveScheduleAndFilterByBoundsWithoutOrganization(bounds, filter);
        } else {
            return await resolveScheduleAndFilterByBoundsWithOrganization(bounds, filter);
        }

    } catch (e) {
        return [];
    }
};

const findActivitiesByCoordinatesUnprivileged = async (location, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }
        if (filter.orgName === null) {
            return await resolveScheduleAndFilterByCoordinatesWithoutOrganizationUnprivileged(location, filter);
        } else {
            return await resolveScheduleAndFilterByCoordinatesWithOrganizationUnprivileged(location, filter);
        }

    } catch (e) {
        console.log(e.message);
        return [];
    }
};

const findActivitiesByCoordinatesPrivileged = async (location, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }
        if (filter.orgName === null) {
            return await resolveScheduleAndFilterByCoordinatesWithoutOrganizationPrivileged(location, filter);
        } else {
            return await resolveScheduleAndFilterByCoordinatesWithOrganizationPrivileged(location, filter);
        }

    } catch (e) {
        console.log(e.message);
        return [];
    }
};

const findActivitiesByOrganizationUnprivileged = async (orgName) => {
    try {
        return await Activity.find({
            orgName
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });
    } catch (e) {
        console.log(e.message);
        return [];
    }
};

const findActivitiesByOrganizationPrivileged = async (orgName) => {
    try {
        return await Activity.find({
            orgName
        }, {
            redundant: 0,
            "location.type": 0
        });
    } catch (e) {
        console.log(e.message);
        return [];
    }
};

module.exports = {
    insertActivity,
    insertActivities,
    deleteActivity,
    deleteActivities,
    editActivity,
    editActivities,
    findActivitiesByBounds,
    findActivitiesByCoordinatesUnprivileged,
    findActivitiesByCoordinatesPrivileged,
    findActivitiesByOrganizationUnprivileged,
    findActivitiesByOrganizationPrivileged
};
