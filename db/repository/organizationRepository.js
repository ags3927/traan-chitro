// needs rigorous testing.

const organizationInterface = require("./../interfaces/organizationInterface.js");
const activityInterface = require("./../interfaces/activityInterface.js");
const cache = require("./../cache");

const findAllOrganizationNames = async () => {
    try {
        const cacheResult = cache.get("allOrganizationName");
        if (cacheResult.found) {
            return {
                status: 'OK',
                data: cacheResult.data
            };
        } else {
            const value = await organizationInterface.findAllOrganizationNames();
            cache.set("allOrganizationName", value.data);
            return {
                status: 'OK',
                data: value.data
            };
        }
    } catch (e) {
        console.log(e.message);
        return {
            status: 'ERROR',
            data: [],
            message: e.message
        }
    }
};


const findOrganizationDetailsUnprivileged = async (orgName) => {
    try {
        const cacheResult = cache.get(orgName + 'UNPRIVILEGED');
        if (cacheResult.found) {
            return {
                status: 'OK',
                data: cacheResult.data
            };
        } else {
            let org = await organizationInterface.findOrganizationByName(orgName);
            let activitiesArray = await activityInterface.findActivitiesByOrganizationUnprivileged(orgName);
            let orgDetails = {
                organization: org.data,
                activities: activitiesArray.data
            };
            cache.setWithExpiration(orgName + 'UNPRIVILEGED', orgDetails, 30 * 60); // 30 minute expiration period
            return {
                status: 'OK',
                data: orgDetails
            };
        }
    } catch (e) {
        console.log(e.message);
        return {
            status: 'ERROR',
            data: null,
            message: e.message
        }
    }
};

const findOrganizationDetailsPrivileged = async (orgName) => {
    try {
        const cacheResult = cache.get(orgName + 'PRIVILEGED');
        if (cacheResult.found) {
            return {
                status: 'OK',
                data: cacheResult.data
            };
        } else {
            let org = await organizationInterface.findOrganizationByName(orgName);
            let activitiesArray = await activityInterface.findActivitiesByOrganizationPrivileged(orgName);
            let orgDetails = {
                organization: org.data,
                activities: activitiesArray.data
            };
            cache.setWithExpiration(orgName + 'PRIVILEGED', orgDetails, 30 * 60); // 30 minute expiration period
            return {
                status: 'OK',
                data: orgDetails
            };
        }
    } catch (e) {
        console.log(e.message);
        return {
            status: 'ERROR',
            data: null,
            message: e.message
        }
    }
};

module.exports = {
    findAllOrganizationNames,
    findOrganizationDetailsUnprivileged,
    findOrganizationDetailsPrivileged
};
