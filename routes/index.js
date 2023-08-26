const express = require('express')
const router = express.Router()
const productRoutes = require('./productRoutes.js')
const categoryRoutes = require('./categoryRoutes.js')
const otherRoutes = require('./otherRoutes.js')
const searchRoutes = require('./searchRoutes.js')
const accountRoutes = require('./accountRoutes.js')
const cartRoutes = require('./cartRoutes.js')

router.use('/products', productRoutes)
router.use('/categories',categoryRoutes)
router.use('/banners', otherRoutes)
router.use('/searchs', searchRoutes)
router.use('/accounts', accountRoutes)
router.use('/carts', cartRoutes)

module.exports = router