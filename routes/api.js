const express = require('express');
const router = express.Router();


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

router.get('/pins', );


module.exports = router;
