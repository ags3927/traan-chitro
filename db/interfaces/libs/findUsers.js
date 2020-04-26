const { User } = require('../../models/user');

let findUserByQuery = async (query,option) => {
    try {
        let data = await User.findOne(query,option);
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

let findUserByIdAndUpdate = async (id,update) => {
    try {
        let data = await User.findByIdAndUpdate(id,update);
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

module.exports = {
    findUserByQuery,
    findUserByIdAndUpdate
}