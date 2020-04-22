const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../db/models/user');

let findByCredentials = async (username,password) => {
    try{
        let user = await User.findOne({ username });

        if (user === null){
            return  'invalid username';
        }

        let matched = await bcrypt.compare(password, user.password);
        if (matched) {
            return {
                _id: user._id
            };
        } else {
            return 'incorrect password';
        }
    } catch (e) {
        return null;
    }
};

let generateAuthToken = async (_id) => {
    try{
        let user = await User.findOne({_id});
        let access = 'auth';
        let token = await jwt.sign({_id: user._id.toString(), access}, 'abc123').toString();

        user.tokens.push({access,token});
        user.save();

        return token;
    } catch (e) {
        return null;
    }
}

let findUserByToken = async (token) => {
    try {
        let decodedUser =  await jwt.verify(token,'abc123');

        return await User.find({
            _id: decodedUser._id
        }, {
            orgName:1
        });
    } catch (e) {
        return null;
    }
};

let removeToken = async(token) => {
    try {
        let decodedUser =  await jwt.verify(token,'abc123');
        console.log(decodedUser)
        return await User.findByIdAndUpdate(decodedUser._id,{
            $pull: {
                tokens: { token }
            }
        });
    } catch (e) {
        return null;
    }
};

module.exports = {
    findByCredentials,
    generateAuthToken,
    findUserByToken,
    removeToken
}