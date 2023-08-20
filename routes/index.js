const productRoutes = require('./productRoutes.js')
const otherRoutes = require('./otherRoutes.js')
const accountRoutes = require('./accountRoutes.js')
const Banners = require('../models/Banners.js')
const express = require('express')
const router = express.Router()

router.use('/products', productRoutes)
router.use('/banners', otherRoutes)
router.use('/accounts', accountRoutes)

module.exports = router