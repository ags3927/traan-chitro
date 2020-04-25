const express = require('express');
const router = express.Router();

const activityController = require('./../controllers/activityController.js');
const organizationController = require('./../controllers/organizationController.js');
const authenticate = require('./../middlwares/authenticate.js');

router.get('/pins', activityController.handleGETPins);

router.get('/activities', activityController.handleGETActivitiesByCoordinates);

router.get('/orgs', organizationController.handleGETOrganizationNames);

router.get('/orgdetails', organizationController.handleGETOrganizationDetails);

router.post('/activity', authenticate.handleAuthentication, activityController.handlePOSTActivity);

router.post('/register', organizationController.handlePOSTRegister);

router.post('/login', authenticate.handlePOSTLogIn);

module.exports = router;
