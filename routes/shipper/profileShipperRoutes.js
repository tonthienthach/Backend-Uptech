const express = require('express');
const router = express.Router();
const profileShipperController = require('../../controllers/shipper/ProfileShipperController');

router.get('/:slug', profileShipperController.getUser);

module.exports = router