const express = require('express')
const router = express.Router()
const Banners = require('../models/Banners');

router.get('/', async (req, res) => {
    const banners = await Banners.find({})
    res.json(banners);
})
module.exports = router


