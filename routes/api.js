const express = require('express');
const router = express.Router();

const activityController = require('./../controllers/activityController');
const organizationController = require('./../controllers/organizationController');
const userController = require('./../controllers/userController');
const authenticate = require('./../middlwares/authenticate');

router.get('/pins', authenticate.handleAuthentication, activityController.handleGETPins);

router.get('/activities', authenticate.handleAuthentication, activityController.handleGETActivitiesByCoordinates);

router.get('/orgs', organizationController.handleGETOrganizationNames);

router.get('/orgdetails', authenticate.handleAuthentication, organizationController.handleGETOrganizationDetails);

router.post('/activity', authenticate.handleAuthentication, activityController.handlePOSTActivity);

router.post('/register', organizationController.handlePOSTRegister);

router.post('/login', authenticate.handlePOSTLogIn);

router.post('/logout', authenticate.handleAuthentication, authenticate.handlePOSTLogOut);

router.patch('/orgdetails', authenticate.handleAuthentication, organizationController.handlePATCHOrganizationDetails);

// router.post('/org', organizationController.handlePOSTOrganization);
//
// router.post('/user', userController.handlePOSTUser);

module.exports = router;
