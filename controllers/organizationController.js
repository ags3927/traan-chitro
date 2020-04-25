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
            orgNames: result
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
        let orgName = JSON.parse(query.orgName);

        let result;
        let privileged =  (res.locals.data.status === 'OK');

        if (false) {
            result = await organizationRepository.findOrganizationDetailsPrivileged(orgName);
        } else {
            result = await organizationRepository.findOrganizationDetailsUnprivileged(orgName);
        }
        return res.status(200).send(result);
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
        let data = {
            orgName: body.orgName,
            description: body.description,
            contact: {
                phone: body.phone
            }
        }
        if (data.contact.email !== null) {
            data.contact.email = body.email;
        }
        if (data.contact.facebook !== null) {
            data.contact.facebook = body.facebook;
        }
        if (data.contact.website !== null) {
            data.contact.website = body.facebook;
        }

        let result = await toBeRegisteredOrganizationInterface.insertToBeRegisteredOrganization(data);

        if (result.status === "OK") {
            res.status(200).send({
                message: 'Registration entry added successfully!'
            })
        } else {
            res.send(500).send({
                message: 'Could not register'
            });
        }

    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            message: 'ERROR in GET /api/register\\Could not get register!',
            error: e.message
        });
    }
}

module.exports = {
    handleGETOrganizationNames,
    handleGETOrganizationDetails,
    handlePOSTRegister
};