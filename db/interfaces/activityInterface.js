const _ = require("lodash");
const moment = require("moment");

const { Activity } = require("../models/activity");

const reliefTypes = ["FOOD", "PPE", "MASK", "SANITIZER", "GLOVE"];


let insertActivity = async (activityObject) => {
    try {
        return await new Activity(activityObject).save();
    } catch (e) {
        return null;
    }
};

let insertActivities = async (activityObjectArray) => {
    try {
        return await Activity.create(activityObjectArray);
    } catch (e) {
        return null;
    }
};

let deleteActivity = async (id) => {
    try {
        return await Activity.findByIdAndDelete(id);
    } catch (e) {
        return null;
    }
};

let deleteActivities = async (orgName) => {
    try {
        return await Activity.deleteMany({ orgName: orgName });
    } catch (e) {
        return null;
    }
};

let editActivity = async (id, activityObject) => {
    try {
        return await Activity.findByIdAndUpdate(id,
            {
                $set:
                    {
                        typeOfRelief: activityObject.typeOfRelief,
                        location: activityObject.location,
                        supplyDate: activityObject.supplyDate,
                        contents: activityObject.contents
                    }
            },
            {
                runValidators: true
            });
    } catch (e) {
        return null;
    }
};

let editActivities = async (prevOrgName, updatedOrgName) => {
    try {
        return await Activity.updateMany(
            {
                orgName: prevOrgName
            },
            {
                $set:
                    {
                        orgName: updatedOrgName
                    }
            },
            {
                runValidators: true
            });
    } catch (e) {
        return null;
    }
};

let resolveScheduleAndFilterByBoundsWithoutOrganization = async (bounds, filter) => {
    if (filter.schedule === "PAST") {
        let locations = await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
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

let resolveScheduleAndFilterByBoundsWithOrganization = async (bounds, filter) => {

    if (filter.schedule === "PAST") {
        let locations = await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
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

let resolveScheduleAndFilterByCoordinatesWithoutOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });
    }
};

let resolveScheduleAndFilterByCoordinatesWithOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
                $gte: moment().valueOf()
            },
            "location.coordinates": [location.lng, location.lat]
        }, {
            redundant: 0,
            "location.type": 0
        });
    }
};

let resolveScheduleAndFilterByCoordinatesWithoutOrganizationUnprivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
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

let resolveScheduleAndFilterByCoordinatesWithOrganizationUnprivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await Activity.find({
            orgName: filter.orgName,
            typeOfRelief: {
                $in: filter.typeOfRelief
            },
            supplyDate: {
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
            supplyDate: {
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

let findActivitiesByBoundsAndFilters = async (bounds, filter) => {
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
        return null;
    }
};

let findActivitiesByCoordinatesAndFiltersUnprivileged = async (location, filter) => {
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
        return null;
    }
};

let findActivitiesByCoordinatesAndFiltersPrivileged = async (location, filter) => {
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
        return null;
    }
};

let findActivitiesByOrganizationUnprivileged = async (orgName) => {
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
        return null;
    }
};

let findActivitiesByOrganizationPrivileged = async (orgName) => {
    try {
        return await Activity.find({
            orgName
        }, {
            redundant: 0,
            "location.type": 0
        });
    } catch (e) {
        return null;
    }
};

module.exports = {
    insertActivity,
    insertActivities,
    deleteActivity,
    deleteActivities,
    editActivity,
    editActivities,
    findActivitiesByBoundsAndFilters,
    findActivitiesByCoordinatesAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersPrivileged,
    findActivitiesByOrganizationUnprivileged,
    findActivitiesByOrganizationPrivileged
};
