const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userInterface = require('../db/interfaces/userInterface');

let handlePOSTLogIn = async (req, res) => {
    try{
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userData = await userInterface.findUserByQuery({ username }, {});
        let user = userData.data;

        if (user === null){
            res.status(500).send({
                message: "User does not exist"
            })
        }

        let matched = await bcrypt.compare(password, user.password);

        if (matched) {
            let access = 'auth';
            let token = await jwt.sign({_id: user._id.toString(), access}, 'abc123').toString();
            user.tokens.push({access,token});
            user.save();

            res.status(200).send({token});
        } else {
            res.status(500).send({
                message: "Incorrect password"
            })
        }
    } catch (e) {
        res.status(500).send({
            message: "ERROR in POST /api/login\\Could not login",
            error: e.message
        });
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
                user,
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
    handlePOSTLogIn,
    handleAuthentication,
    handleLogOut
}
