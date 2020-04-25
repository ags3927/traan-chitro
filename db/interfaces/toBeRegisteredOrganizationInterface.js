const { ToBeRegisteredOrganization } = require('../models/organization');

let insertToBeRegisteredOrganization = async (orgObject) => {
    try {
        let data = await new ToBeRegisteredOrganization(orgObject).save();
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

const deleteToBeRegisteredOrganization = async (orgName) => {
    try {
        let data = await ToBeRegisteredOrganization.findOneAndDelete({ orgName: orgName });
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

const editToBeRegisteredOrganization = async (orgName, orgObject) => {
    try {
        let data = await ToBeRegisteredOrganization.findOneAndUpdate(
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
    insertToBeRegisteredOrganization,
    deleteToBeRegisteredOrganization,
    editToBeRegisteredOrganization
}