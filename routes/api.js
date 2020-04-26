const express = require('express');
const router = express.Router();

const activityController = require('./../controllers/activityController.js');
const organizationController = require('./../controllers/organizationController.js');
const authenticate = require('./../middlwares/authenticate.js');

router.get('/pins', authenticate.handleAuthentication, activityController.handleGETPins);

router.get('/activities', authenticate.handleAuthentication, activityController.handleGETActivitiesByCoordinates);

router.get('/orgs', organizationController.handleGETOrganizationNames);

router.get('/orgdetails', authenticate.handleAuthentication, organizationController.handleGETOrganizationDetails);

router.post('/activity', authenticate.handleAuthentication, activityController.handlePOSTActivity);

router.post('/register', organizationController.handlePOSTRegister);

router.post('/login', authenticate.handlePOSTLogIn);

router.post('/logout', authenticate.handleAuthentication, authenticate.handlePOSTLogOut);

router.patch('/orgdetails', authenticate.handleAuthentication, organizationController.handlePATCHOrganizationDetails);

module.exports = router;
