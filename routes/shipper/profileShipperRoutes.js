const express = require('express');
const router = express.Router();
const profileShipperController = require('../../controllers/shipper/ProfileShipperController');

router.get('/:slug', profileShipperController.getUser);
router.put('/edit/', profileShipperController.editProfile);
module.exports = router