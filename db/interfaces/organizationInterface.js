let _ = require("lodash");

let { Organization } = require("../models/organization");
let activityInterface = require("./activityInterface");

let insertOrganization = async (orgObject) => {

    try {
        return await new Organization(orgObject).save();
    } catch (e) {
        return null;
    }
};

const deleteOrganization = async (name) => {
    try {
        await activityInterface.deleteActivities(name);
        return await Organization.findOneAndDelete({ name: name });
    } catch (e) {
        return null;
    }
};

const editOrganization = async (orgName, orgObject) => {
    try {
        if (name !== orgObject.name) {
            await activityInterface.editActivities(orgName, orgObject.orgName);
        }
        return await Organization.findOneAndUpdate({ orgName: orgName }, {
            $set: {
                orgName: orgObject.orgName,
                description: orgObject.description,
                contact: orgObject.contact
            }
        }, { runValidators: true } );
    } catch (e) {
        return null;
    }
};

const findOrganizationByName = async (orgName) => {
    try {
      return await Organization.find({ orgName: orgName });
    } catch (e) {
      return null;
    }
};

const findAllOrganizations = async () => {
    try {
      return await Organization.find();
    } catch (e) {
      return null;
    }
};

const findAllOrganizationNames = async () => {
    try {
      let orgObjects = await Organization.find({}, { _id: 0, orgName: 1 });
      return _.map(orgObjects, (orgObject) => {
          return orgObject.orgName;
      });
    } catch (e) {
      return null;
    }
};

const findAllActivities = async (orgName) => {
    try {
        return await activityInterface.findAllActivitiesOfOrganization(orgName);
    } catch (e) {
        return null;
    }
};

module.exports = {
    insertOrganization,
    deleteOrganization,
    editOrganization,
    findAllOrganizations,
    findOrganizationByName,
    findAllOrganizationNames,
    findAllActivities
};
