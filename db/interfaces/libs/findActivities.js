const _ = require("lodash");
const moment = require("moment");

const { Activity } = require("../../models/activity");

const reliefTypes = ["FOOD", "PPE", "MASK", "SANITIZER", "GLOVE"];

let findActivitiesByBoundsByQuery = async (queryOrgName,queryTypeOfRelief,querySchedule,queryLocation) => {
    try {
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

        let data = Array.from(new Set(coordinatesArray.map(JSON.stringify))).map(JSON.parse);
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return null;
    }
}

let findActivitiesByCoordinatesByQuery = async (queryOrgName,queryTypeOfRelief,querySchedule,queryLocation,options) => {
    try {
        let data = await Activity.find({
            $and: [
                queryOrgName,
                queryTypeOfRelief,
                querySchedule,
                queryLocation
            ]
        }, options);
        return {
            data,
            status: "OK"
        }
    } catch (e) {
        return null;
    }
};

let resolveFilterByBoundsWithoutOrganizationPrivileged = async (bounds, filter) => {
    try {
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
    } catch (e) {
        return null;
    }
};

let resolveFilterByBoundsWithOrganizationPrivileged = async (bounds, filter) => {
    try {
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
    } catch (e) {
        return null;
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
        return {
            data: [],
            status: "ERROR"
        };
    }
};

let resolveFilterByBoundsWithoutOrganizationUnprivileged = async (bounds, filter) => {
    try {
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
    } catch (e) {
        return null;
    }
};

let resolveFilterByBoundsWithOrganizationUnprivileged = async (bounds, filter) => {
    try {
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
    } catch (e) {
        return null;
    }
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
        return {
            data: [],
            status: "ERROR"
        };
    }
};

let resolveFilterByCoordinatesWithoutOrganizationPrivileged = async (location, filter) => {
    try {
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
    } catch (e) {
        return null;
    }
};

let resolveFilterByCoordinatesWithOrganizationPrivileged = async (location, filter) => {
    try {
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
            return await resolveFilterByCoordinatesWithoutOrganizationPrivileged(location, filter);
        } else {
            return await resolveFilterByCoordinatesWithOrganizationPrivileged(location, filter);
        }

    } catch (e) {
        return {
            data: [],
            status: "ERROR"
        };
    }
};

let resolveFilterByCoordinatesWithoutOrganizationUnprivileged = async (location,filter) => {
    try {
        return await findActivitiesByCoordinatesByQuery(
            {},
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0, supplyDate: 0, contents: 0 });
    } catch (e) {
        return null;
    }
};

let resolveFilterByCoordinatesWithOrganizationUnprivileged = async (location, filter) => {
    try {
        return await findActivitiesByCoordinatesByQuery(
            { orgName: filter.orgName },
            { typeOfRelief: { $in: filter.typeOfRelief } },
            {},
            { "location.coordinates": [location.lng, location.lat] },
            { redundant: 0, "location.type": 0, supplyDate: 0, contents: 0 });
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
            return await resolveFilterByCoordinatesWithoutOrganizationUnprivileged(location, filter);
        } else {
            return await resolveFilterByCoordinatesWithOrganizationUnprivileged(location, filter);
        }
    } catch (e) {
        return {
            data: [],
            status: "ERROR"
        };
    }
};

let findActivitiesByOrganizationPrivileged = async (orgName) => {
    try {
        let data = await Activity.find({
            orgName
        }, {
            redundant: 0,
            "location.type": 0
        });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: [],
            status: "ERROR"
        };
    }
};

let findActivitiesByOrganizationUnprivileged = async (orgName) => {
    try {
        let data = await Activity.find({
            orgName
        }, {
            redundant: 0,
            "location.type": 0,
            supplyDate: 0,
            contents: 0
        });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: [],
            status: "ERROR"
        };
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