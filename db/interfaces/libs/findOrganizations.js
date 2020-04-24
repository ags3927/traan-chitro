const _ = require("lodash");

const { Organization } = require("../../models/organization");

const findOrganizationByName = async (orgName) => {
    try {
        let data = await Organization.find({ orgName: orgName });
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

const findAllOrganizations = async () => {
    try {
        let data = await Organization.find();
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
            data: e.message,
            status: "ERROR"
        };
    }
};

module.exports = {
    findOrganizationByName,
    findAllOrganizations,
    findAllOrganizationNames
}