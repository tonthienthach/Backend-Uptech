const express = require('express')
const router = express.Router()
const Banners = require('../models/Banners');
const othersController = require('../controllers/othersController');

router.get('/', async (req, res) => {
    const banners = await Banners.find({})
    res.json(banners);
})

module.exports = router


