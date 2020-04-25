const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userInterface = require('../db/interfaces/userInterface');

let handleLogIn = async (req, res, next) => {
    try{
        let query = req.query;
        let username = JSON.parse(query.username);
        let password = JSON.parse(query.password);
        let userData = await userInterface.findUserByQuery({ username }, {});
        let user = userData.data;

        if (user === null){
            next( new Error("invalid username") );
        }

        let matched = await bcrypt.compare(password, user.password);
        if (matched) {
            let access = 'auth';
            let token = await jwt.sign({_id: user._id.toString(), access}, 'abc123').toString();
            user.tokens.push({access,token});
            user.save();
            res.locals.data = {
                data: token,
                status: "OK"
            };
            next();
        } else {
            next( new Error("incorrect password") );
        }
    } catch (e) {
        next(e);
    }
};

let handleAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser =  await jwt.verify(token,'abc123');

        let userData = await userInterface.findUserByQuery({ _id: decodedUser._id }, { orgName:1 });
        let user = userData.data;
        if (user){
            res.locals.data = {
                data: user,
                status: "OK"
            };
        } else {
            res.locals.data = {
                data: null,
                status: "ERROR"
            };
        }
        next();
    } catch (e) {
        next(e);
    }
};

let handleLogOut = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser =  await jwt.verify(token,'abc123');

        await userInterface.findUserByIdAndUpdate(decodedUser._id,{
            $pull: {
                tokens: { token }
            }
        });

        res.locals.data = {
            data: "Logged Out",
            status: "OK"
        };
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = {
    handleLogIn,
    handleAuthentication,
    handleLogOut
}
