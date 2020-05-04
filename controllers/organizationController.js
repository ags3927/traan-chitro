const organizationRepository = require('./../db/repository/organizationRepository.js');
const organizationInterface = require('./../db/interfaces/organizationInterface.js');
const toBeRegisteredOrganizationInterface = require('./../db/interfaces/toBeRegisteredOrganizationInterface.js');
const cache = require('./../db/cache');

/**
 * Handles GET orgs request for the names of all organizations
 * @param req
 * @param res
 * @returns {Promise<[String]>} - Returns an array of strings, which are the names of all organizations
 */
const handleGETOrganizationNames = async (req, res) => {
    try {
        let result = await organizationRepository.findAllOrganizationNames();
        return res.status(200).send({
            orgNames: result.data
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: "ERROR in GET /api/orgs\\Could not get organization names",
            error: e.message
        });
    }
};

/**
 * Handles GET orgdetails request for the details of an organization
 * @param req
 * @param res
 * @returns {Promise<*|void|boolean>}
 */
const handleGETOrganizationDetails = async (req, res) => {
    try {
        let query = req.query;
        let orgName = query.orgName;

        let result;
        let privileged =  (res.locals.middlewareResponse.status === 'OK');

        if (privileged) {
            result = await organizationRepository.findOrganizationDetailsPrivileged(orgName);
        } else {
            result = await organizationRepository.findOrganizationDetailsUnprivileged(orgName);
        }
        if (result.status === 'OK') {
            res.status(200).send(result.data);
        } else {
            res.status(500).send({
                message: 'Could not find organization names'
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: 'ERROR in GET /api/orgdetails\\Could not get organization details',
            error: e.message
        });
    }
};

const handlePOSTRegister = async (req, res, next) => {
    try {
        let body = req.body;

        let result = await toBeRegisteredOrganizationInterface.
                                insertToBeRegisteredOrganization(buildOrganizationObject(body));

        if (result.status === "OK") {
            // res.status(200).send({
            //     message: 'Registration entry added successfully!'
            // })
            res.locals.middlewareResponse = {
                inserted: true,
                responseStatus: 200,
                responseObject: {
                    message: "Registration entry added successfully!"
                }
            };
            next();
        } else {
            console.log(result.data);
            // res.status(500).send({
            //     message: 'Could not register',
            //     error: result.message
            // });

            res.locals.middlewareResponse = {
                inserted: false,
                responseStatus: 500,
                responseObject: {
                    message: "Could not register"
                }
            };
            next();
        }
    } catch (e) {
        console.log(e.message);
        // return res.status(500).send({
        //     message: 'ERROR in GET /api/register\\Could not get register!',
        //     error: e.message
        // });
        res.locals.middlewareResponse = {
            inserted: false,
            responseStatus: 500,
            responseObject: {
                message: "ERROR in GET /api/register\\\\Could not get register!"
            }
        };
        next();
    }
};


const buildOrganizationObject = (body) => {
    let data = {
        orgName: body.orgName,
        description: body.description,
        contact: {}
    }
    if (body.phones.length > 0) {
        data.contact.phones = body.phones;
    } else {
        data.contact.phones = [];
    }
    if (body.activityLocations !== null) {
        data.activityLocations = body.activityLocations;
    }
    if (body.email !== null) {
        console.log("vodox1");
        data.contact.email = body.email;
        console.log("vodox2");
    }
    if (body.facebook !== null) {
        data.contact.facebook = body.facebook;
    }
    if (body.website !== null) {
        data.contact.website = body.website;
    }
    if (body.donate !== null) {
        data.contact.donate = body.donate;
    }
    return data;
}


const handlePATCHOrganizationDetails = async (req, res) => {
    try{
        let body = req.body;
        let data = buildOrganizationObject(body);

        let privileged =  (res.locals.middlewareResponse.status === 'OK');

        if (privileged && data.orgName === res.locals.middlewareResponse.user.orgName) {

            console.log(data);

            let result = await organizationInterface.editOrganization(
                res.locals.middlewareResponse.user.orgName, data);

            console.log(result);

            if (result.status === 'OK') {
                let value = await organizationInterface.findAllOrganizationNames();
                cache.set("allOrganizationName", value.data);

                res.status(200).send({
                    message: 'Organization details updated successfully'
                });
            } else {
                res.status(500).send({
                    message: 'Could not update organization details'
                });
            }
        } else {
            res.status(500).send({
                message: 'User not authenticated to edit this profile'
            });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            message: 'ERROR in GET /api/register\\Could not get register!',
            error: e.message
        });
    }
};

const handlePOSTOrganization = async (req, res) => {
    try {
        let token = req.header('x-auth');
        let privileged = token === 'lekhaporaputkirmoddhebhoiradimu';
        let body = req.body;
        console.log('BODY = ', body);
        //let privileged = res.locals.middlewareResponse.status === 'OK';

        if (privileged) {
            let org = buildOrganizationObject(body);
            let result = await organizationInterface.insertOrganization(org);

            if (result.status === 'OK') {
                let value = await organizationInterface.findAllOrganizationNames();
                cache.set("allOrganizationName", value.data);

                res.status(200).send({
                    message: 'Organization inserted successfully'
                });
            } else {
                console.log(result.message);
                res.status(500).send({
                    message: 'Could not insert organization',
                    error: result.message
                });
            }
        } else {
            console.log('User not authorized to perform this action')
            res.status(500).send({
                message: 'User not authorized to perform this action'
            });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            message: 'ERROR in POST /api/org\\Could not post organization!',
            error: e.message
        });
    }
}

module.exports = {
    handleGETOrganizationNames,
    handleGETOrganizationDetails,
    handlePOSTRegister,
    handlePATCHOrganizationDetails,
    handlePOSTOrganization
};