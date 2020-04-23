const { User } = require('../models/user');
const organizationInterface = require('./organizationInterface');

let insertUser = async (userObject) => {
    try {
        let user = new User(userObject);
        return await user.save();
    } catch (e) {
        return null;
    }
};

let insertUsers = async (userObjectArray) => {
    try {
        return await User.create(userObjectArray);
    } catch (e) {
        console.log(e.message)
        return null;
    }
};

let deleteUser = async (orgName) => {
    try {
        await organizationInterface.deleteOrganization(orgName);
        return await User.findOneAndDelete({ orgName });
    } catch (e) {
        return null;
    }
};

let editUser = async (orgName, userObject) => {
    try {
        return await User.findOneAndUpdate( { orgName },
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
    } catch (e) {
        return null;
    }
};

let updateUserByOrgName = async (prevOrgName, updatedOrgName) => {
    try {
        return await User.findOneAndUpdate( { orgName: prevOrgName },
            {
                $set:
                    {
                        orgName: updatedOrgName,
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
    insertUser,
    insertUsers,
    deleteUser,
    editUser,
    updateUserByOrgName
}


