const { Organization } = require("../models/organization");
const activityInterface = require("./activityInterface");
const userInterface = require("./userInterface");
const _ = require("lodash");

let insertOrganization = async (orgObject) => {
    try {
        let data = await new Organization(orgObject).save();
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            message: e.message,
            data: null,
            status: "ERROR"
        };
    }
};

const deleteOrganization = async (orgName) => {
    try {
        await activityInterface.deleteActivities(orgName);
        let data = await Organization.findOneAndDelete({ orgName: orgName });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            message: e.message,
            data: null,
            status: "ERROR"
        };
    }
};

const editOrganization = async (orgName, orgObject) => {
    try {
        if (orgName !== orgObject.orgName) {
            await userInterface.updateUserByOrganizationName(orgName, orgObject.orgName);
            await activityInterface.editActivities(orgName, orgObject.orgName);
        }

        let data = await Organization.findOneAndUpdate(
            {
                orgName: orgName
            },
            {
                $set:
                    {
                        orgName: orgObject.orgName,
                        description: orgObject.description,
                        contact: orgObject.contact
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
            message: e.message,
            data: null,
            status: "ERROR"
        };
    }
};

const findOrganizationByName = async (orgName) => {
    try {
        let data = await Organization.findOne({ orgName: orgName });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            message: e.message,
            data: null,
            status: "ERROR"
        };
    }
};

const findAllOrganizations = async () => {
    try {
        let data = await Organization.find();
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            message: e.message,
            data: [],
            status: "ERROR"
        };
    }
};

const findAllOrganizationNames = async () => {
    try {
        let orgObjects = await Organization.find({}, { _id: 0, orgName: 1 });
        let data = _.map(orgObjects, (orgObject) => {
            return orgObject.orgName;
        });
        return {
            data,
            status: "OK"
        };
    } catch (e) {
        return {
            message: e.message,
            data: [],
            status: "ERROR"
        };
    }
};

module.exports = {
    insertOrganization,
    deleteOrganization,
    editOrganization,
    findAllOrganizations,
    findOrganizationByName,
    findAllOrganizationNames,
};

