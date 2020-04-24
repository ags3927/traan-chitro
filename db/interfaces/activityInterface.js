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

module.exports = {
    insertActivity,
    insertActivities,
    deleteActivity,
    deleteActivities,
    editActivity,
    editActivities,
    findActivitiesByBoundsAndFiltersPrivileged,
    findActivitiesByBoundsAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersUnprivileged,
    findActivitiesByCoordinatesAndFiltersPrivileged,
    findActivitiesByOrganizationUnprivileged,
    findActivitiesByOrganizationPrivileged
};
