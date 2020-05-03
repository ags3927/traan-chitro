const userInterface = require('./../db/interfaces/userInterface');

const handlePOSTUser = async (req, res) => {
    try {
        let token = req.header('x-auth');
        let privileged = token === 'lekhaporaputkirmoddhebhoiradimu';
        let body = req.body;
        // let privileged = res.locals.middlewareResponse.status === 'OK';
        if (privileged) {
            let result = await userInterface.insertUser({
                orgName: body.orgName,
                username: body.username,
                password: body.password
            });
            if (result.status === 'OK') {
                res.status(200).send({
                    message: 'User inserted successfully'
                });
            } else {
                res.status(500).send({
                    message: 'Could not insert user',
                    error: result.message
                });
            }
        } else {
            res.status(500).send({
                message: 'User not authorized to perform this action'
            });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            message: "ERROR in POST /api/user\\Could not insert user",
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTUser
}