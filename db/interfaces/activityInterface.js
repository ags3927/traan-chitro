const _ = require("lodash");

const { Activity } = require("../models/activity");

let {
    findActivitiesByBoundsAndFiltersPrivileged,
    findActivitiesByBoundsAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersPrivileged,
    findActivitiesByCoordinatesAndFiltersUnprivileged,
    findActivitiesByOrganizationPrivileged,
    findActivitiesByOrganizationUnprivileged
} = require('./libs/findActivities');

let insertActivity = async (activityObject) => {
    try {
        let data = await new Activity(activityObject).save();
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let insertActivities = async (activityObjectArray) => {
    try {
        let data = await Activity.create(activityObjectArray);
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let deleteActivity = async (id) => {
    try {
        let data = await Activity.findByIdAndDelete(id);
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let deleteActivities = async (orgName) => {
    try {
        let data = await Activity.deleteMany({ orgName: orgName });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let editActivity = async (id, activityObject) => {
    try {
        let data = await Activity.findByIdAndUpdate(id,
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
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let editActivities = async (prevOrgName, updatedOrgName) => {
    try {
        let data = await Activity.updateMany(
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
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

let createActivityAndInsert = async (activitiesData) => {
    try {
        let activityObjectArray = [];
        activitiesData.typeOfRelief.forEach((element) => {
            activityObjectArray.push({
                orgName: activitiesData.orgName,
                typeOfRelief: element,
                location: {
                    type: "Point",
                    coordinates: [activitiesData.location.lng,activitiesData.location.lat]
                },
                supplyDate: activitiesData.supplyDate,
                contents: activitiesData.contents
            });
        });

         return await insertActivities(activityObjectArray);

    } catch (e) {
        return {
            data: e.message,
            status: "ERROR"
        };
    }
};

module.exports = {
    insertActivity,
    insertActivities,
    deleteActivity,
    deleteActivities,
    editActivity,
    editActivities,
    createActivityAndInsert,
    findActivitiesByBoundsAndFiltersPrivileged,
    findActivitiesByBoundsAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersPrivileged,
    findActivitiesByOrganizationUnprivileged,
    findActivitiesByOrganizationPrivileged
};
