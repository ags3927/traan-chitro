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
            let token = await jwt.sign({_id: user._id.toString(), access}, 'lekhaporaputkirmoddhebhoiradimu').toString();
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
        let decodedUser =  await jwt.verify(token,'lekhaporaputkirmoddhebhoiradimu');

        let userData = await userInterface.findUserByQuery({ _id: decodedUser._id }, { orgName:1 });
        let user = userData.data;
        if (user){
            res.locals.middlewareResponse = {
                user,
                token,
                status: "OK"
            };
        } else {
            res.locals.middlewareResponse = {
                status: "ERROR"
            };
        }
        next();
    } catch (e) {
        res.locals.middlewareResponse = {
            status: "ERROR"
        };
        next();
    }
};

let handlePOSTLogOut = async (req, res) => {
    try {
        let user = res.locals.middlewareResponse.user;
        let token = res.locals.middlewareResponse.token;
        console.log("TOKEN - ", token);
        console.log(user);

        await userInterface.findUserByIdAndUpdate(user._id,{
            $pull: {
                tokens: { token }
            }
        });

        res.status(200).send({
            message: "Successfully Logged Out"
        });
    } catch (e) {
        res.status(500).send({
            message: "ERROR in POST /api/logout\\Could not logout",
            error: e.message
        });
    }
};

module.exports = {
    handlePOSTLogIn,
    handleAuthentication,
    handlePOSTLogOut
}
