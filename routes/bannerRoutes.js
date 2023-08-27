const express = require('express')
const router = express.Router()
const Banners = require('../models/Banners');
const bannersController = require('../controllers/bannersController');

router.get('/', bannersController.getBannerImgs)

module.exports = router


