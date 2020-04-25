const { User } = require('../models/user');
const organizationInterface = require('./organizationInterface');

let {
    findUserByIdAndUpdate,
    findUserByQuery
} = require('./libs/findUsers');

let insertUser = async (userObject) => {
    try {
        let user = new User(userObject);
        let data = await user.save();
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

let insertUsers = async (userObjectArray) => {
    try {
        let data = await User.create(userObjectArray);
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

let deleteUser = async (orgName) => {
    try {
        await organizationInterface.deleteOrganization(orgName);
        let data = await User.findOneAndDelete({ orgName });
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

let editUser = async (orgName, userObject) => {
    try {
        let data = await User.findOneAndUpdate( { orgName },
            {
                $set:
                    {
                        username: userObject.username,
                        password: userObject.password,
                        orgName: userObject.orgName,
                        tokens: []
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

let updateUserByOrganizationName = async (prevOrgName, updatedOrgName) => {
    try {
        let data = await User.findOneAndUpdate( { orgName: prevOrgName },
            {
                $set:
                    {
                        orgName: updatedOrgName,
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
    insertUser,
    insertUsers,
    deleteUser,
    editUser,
    updateUserByOrganizationName,
    findUserByIdAndUpdate,
    findUserByQuery
}


