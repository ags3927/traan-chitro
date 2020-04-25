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
            data: e.message,
            status: "ERROR"
        };
    }
};

let findUserByIdAndUpdate = async (id,update) => {
    try {
        let data = User.findByIdAndUpdate(id,update);
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
    findUserByQuery,
    findUserByIdAndUpdate
}