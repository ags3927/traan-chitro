const organizationRepository = require('./../db/repository/organizationRepository.js');
const organizationInterface = require('./../db/interfaces/organizationInterface.js');

/**
 * Handles GET orgs request for the names of all organizations
 * @param req
 * @param res
 * @returns {Promise<[String]>} - Returns an array of strings, which are the names of all organizations
 */
const handleGETOrganizationNames = async (req, res) => {
    try {
        let result = await organizationRepository.findAllOrganizationNames();
        return res.status(200).send(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("ERROR in GET /api/orgs\\Could not get organization names");
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
        let result;
        if (req.body.privileged) {
            result = await organizationRepository.findOrganizationDetailsPrivileged(req.body.orgName);
        } else {
            result = await organizationRepository.findOrganizationDetailsUnprivileged(req.body.orgName);
        }
        return res.status(200).send(result);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("ERROR in GET /api/orgdetails\\Could not get organization details");
    }
};

module.exports = {
    handleGETOrganizationNames,
    handleGETOrganizationDetails
};