const express = require('express');
const router = express.Router();
const profileShipperController = require('../../controllers/shipper/profileShipperController');
const verifyToken = require('../../middlewares/verifyToken')

router.get('/', verifyToken, profileShipperController.getUser);
router.put('/edit/', profileShipperController.editProfile);
router.post('/checkPass/', profileShipperController.checkPassWord);
module.exports = router