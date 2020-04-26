const organizationRepository = require('./../db/repository/organizationRepository.js');
const organizationInterface = require('./../db/interfaces/organizationInterface.js');
const toBeRegisteredOrganizationInterface = require('./../db/interfaces/toBeRegisteredOrganizationInterface.js');

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

const handlePOSTRegister = async (req, res) => {
    try {
        let body = req.body;

        let result = await toBeRegisteredOrganizationInterface.
                                insertToBeRegisteredOrganization(buildOrganizationObject(body));

        if (result.status === "OK") {
            res.status(200).send({
                message: 'Registration entry added successfully!'
            })
        } else {
            console.log(result.data);
            res.status(500).send({
                message: 'Could not register',
                error: result.message
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: 'ERROR in GET /api/register\\Could not get register!',
            error: e.message
        });
    }
};


const buildOrganizationObject = (body) => {
    let data = {
        orgName: body.orgName,
        description: body.description,
        contact: {
            phone: body.phone
        }
    }
    if (body.email !== null) {
        data.contact.email = body.email;
    }
    if (body.facebook !== null) {
        data.contact.facebook = body.facebook;
    }
    if (body.website !== null) {
        data.contact.website = body.website;
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

module.exports = {
    handleGETOrganizationNames,
    handleGETOrganizationDetails,
    handlePOSTRegister,
    handlePATCHOrganizationDetails
};