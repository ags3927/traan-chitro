const express = require('express');
const router = express.Router();

const activityController = require('./../controllers/activityController');
const organizationController = require('./../controllers/organizationController');
const userController = require('./../controllers/userController');
const rateLimiter = require('./../middlwares/rateLimit');
const authenticate = require('./../middlwares/authenticate');
const mailSender = require('./../middlwares/mailSender');


router.get('/pins',
    activityController.handleGETPins
);

router.get('/activities',
    activityController.handleGETActivitiesByCoordinates
);

router.get('/orgs',
    organizationController.handleGETOrganizationNames
);

router.get('/orgdetails',
    organizationController.handleGETOrganizationDetails
);

router.post('/activity',
    activityController.handlePOSTActivity
);

router.post('/register',
    organizationController.handlePOSTRegister,
    mailSender.sendMailHandler,
    rateLimiter.rateLimiterMiddlewareRegister
);

router.post('/login',
    authenticate.handlePOSTLogIn,
    rateLimiter.rateLimiterMiddlewareAfter
);

router.post('/logout',
    authenticate.handlePOSTLogOut
);

router.patch('/orgdetails',
    authenticate.handleAuthentication,
    organizationController.handlePATCHOrganizationDetails
);

router.post('/org', organizationController.handlePOSTOrganization);

router.post('/user', userController.handlePOSTUser);

router.post('/activities', activityController.handlePOSTActivities);

module.exports = router;
