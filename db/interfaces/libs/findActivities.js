const _ = require("lodash");
const moment = require("moment");

const { Activity } = require("../../models/activity");

const reliefTypes = ["FOOD", "PPE", "MASK", "SANITIZER", "GLOVE"];

let findActivitiesByBoundsByQuery = async (queryOrgName,queryTypeOfRelief,querySchedule,queryLocation) => {
    let locations = await Activity.find({
        $and: [
            queryOrgName,
            queryTypeOfRelief,
            querySchedule,
            queryLocation
        ]
    }, {
        _id: 0,
        "location.coordinates": 1
    });

    let coordinatesArray = _.map(locations, (element) => {
        return {
            lat: element.location.coordinates[1],
            lng: element.location.coordinates[0],
        };
    });

    return Array.from(new Set(coordinatesArray.map(JSON.stringify))).map(JSON.parse);
}

let findActivitiesByCoordinatesByQuery = async (queryOrgName,queryTypeOfRelief,querySchedule,queryLocation,options) => {
    return await Activity.find({
        $and: [
            queryOrgName,
            queryTypeOfRelief,
            querySchedule,
            queryLocation
        ]
    }, options);
};

let resolveFilterByBoundsWithoutOrganizationPrivileged = async (bounds, filter) => {
    if (filter.schedule === "PAST") {
        return await findActivitiesByBoundsByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $lte: moment().valueOf() } },
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    } else if(filter.schedule === "SCHEDULED") {
        return await findActivitiesByBoundsByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $gt: moment().valueOf() } },
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    } else {
        return await findActivitiesByBoundsByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    }
};

let resolveFilterByBoundsWithOrganizationPrivileged = async (bounds, filter) => {
    if (filter.schedule === "PAST") {
        return await findActivitiesByBoundsByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $lte: moment().valueOf() } },
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    } else if(filter.schedule === "SCHEDULED"){
        return await findActivitiesByBoundsByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $gt: moment().valueOf() } },
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    } else {
        return await findActivitiesByBoundsByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            {
                location: {
                    $geoWithin: {
                        $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                    }
                }
            });
    }
};

let findActivitiesByBoundsAndFiltersPrivileged = async (bounds, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }

        if (filter.orgName === null) {
            return await resolveFilterByBoundsWithoutOrganizationPrivileged(bounds, filter);
        } else {
            return await resolveFilterByBoundsWithOrganizationPrivileged(bounds, filter);
        }

    } catch (e) {
        return null;
    }
};

let resolveFilterByBoundsWithoutOrganizationUnprivileged = async (bounds, filter) => {
    return await findActivitiesByBoundsByQuery(
        {},
        { typeOfRelief: { $in: filter.typeOfRelief } },
        {},
        {
            location: {
                $geoWithin: {
                    $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        });
};

let resolveFilterByBoundsWithOrganizationUnprivileged = async (bounds, filter) => {
    return await findActivitiesByBoundsByQuery(
        { orgName: filter.orgName },
        { typeOfRelief: { $in: filter.typeOfRelief } },
        {},
        {
            location: {
                $geoWithin: {
                    $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
                }
            }
        });
};

let findActivitiesByBoundsAndFiltersUnprivileged = async (bounds, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }

        if (filter.orgName === null) {
            return await resolveFilterByBoundsWithoutOrganizationUnprivileged(bounds, filter);
        } else {
            return await resolveFilterByBoundsWithOrganizationUnprivileged(bounds, filter);
        }

    } catch (e) {
        return null;
    }
};

let resolveFilterByCoordinatesWithoutOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await findActivitiesByCoordinatesByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $lte: moment().valueOf() } },
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    } else if(filter.schedule === "SCHEDULED") {
        return await findActivitiesByCoordinatesByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $gt: moment().valueOf() } },
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    } else {
        return await findActivitiesByCoordinatesByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    }
};

let resolveFilterByCoordinatesWithOrganizationPrivileged = async (location, filter) => {
    if (filter.schedule === "PAST") {
        return await findActivitiesByCoordinatesByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $lte: moment().valueOf() } },
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    } else if(filter.schedule === "SCHEDULED"){
        return await findActivitiesByCoordinatesByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            { supplyDate: { $gt: moment().valueOf() } },
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    } else {
        return await findActivitiesByCoordinatesByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0 });
    }
};

let findActivitiesByCoordinatesAndFiltersPrivileged = async (location, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }
        if (filter.orgName === null) {
            return await resolveFilterByCoordinatesWithoutOrganizationPrivileged(location, filter);
        } else {
            return await resolveFilterByCoordinatesWithOrganizationPrivileged(location, filter);
        }

    } catch (e) {
        return null;
    }
};

let resolveFilterByCoordinatesWithoutOrganizationUnprivileged = async (location,filter) => {
    return await findActivitiesByCoordinatesByQuery(
        {},
        { typeOfRelief: { $in: filter.typeOfRelief } },
        {},
        { "location.coordinates": [location.lng, location.lat] },
        { redundant: 0, "location.type": 0, supplyDate: 0, contents: 0 });
};

let resolveFilterByCoordinatesWithOrganizationUnprivileged = async (location, filter) => {
    return await findActivitiesByCoordinatesByQuery(
        { orgName: filter.orgName },
        { typeOfRelief: { $in: filter.typeOfRelief } },
        {},
        { "location.coordinates": [location.lng, location.lat] },
        { redundant: 0, "location.type": 0, supplyDate: 0, contents: 0 });
};

let findActivitiesByCoordinatesAndFiltersUnprivileged = async (location, filter) => {
    try {
        if (filter.typeOfRelief.length === 0) {
            filter.typeOfRelief = reliefTypes;
        }
        if (filter.orgName === null) {
            return await resolveFilterByCoordinatesWithoutOrganizationUnprivileged(location, filter);
        } else {
            return await resolveFilterByCoordinatesWithOrganizationUnprivileged(location, filter);
        }
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

module.exports = {
    findActivitiesByBoundsAndFiltersPrivileged,
    findActivitiesByBoundsAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersPrivileged,
    findActivitiesByCoordinatesAndFiltersUnprivileged,
    findActivitiesByOrganizationPrivileged,
    findActivitiesByOrganizationUnprivileged
}