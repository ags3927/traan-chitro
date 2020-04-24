const { Organization } = require("../models/organization");
const activityInterface = require("./activityInterface");
const userInterface = require("./userInterface");

let {
    findOrganizationByName,
    findAllOrganizations,
    findAllOrganizationNames
} = require('./libs/findOrganizations');

let insertOrganization = async (orgObject) => {
    try {
        let data = await new Organization(orgObject).save();
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
            data: e.message,
            status: "ERROR"
        };
    }
};

const editOrganization = async (orgName, orgObject) => {
    try {
        if (orgName !== orgObject.orgName) {
            await userInterface.updateUserByOrgName(orgName, orgObject.orgName);
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
            data: e.message,
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

