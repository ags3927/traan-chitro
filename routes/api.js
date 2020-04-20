const express = require('express');
const router = express.Router();

const activityController = require('./../controllers/activityController.js');
const organizationController = require('./../controllers/organizationController.js');

router.get('/', function(req, res, next) {
    try {
        return res.status(200).send({
            status: 'OK',
            route: '/api'
        });
    } catch (e) {
        return res.sendStatus(400);
    }
});

router.get('/test', async function (req, res) {
    try {
        return res.status(200).send({
            status: 'OK',
            route: '/api/test'
        });
    } catch (e) {
        return res.sendStatus(400);
    }
});

router.get('/pins', activityController.handleGETPins);

router.get('/activities', activityController.handleGETActivitiesByCoordinates);

router.get('/orgs', organizationController.handleGETOrganizationNames);

router.get('/orgdetails', organizationController.handleGETOrganizationDetails);



module.exports = router;
