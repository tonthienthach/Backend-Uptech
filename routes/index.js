
const express = require('express')
const router = express.Router()
const productRoutes = require('./productRoutes.js')
const categoryRoutes = require('./categoryRoutes.js')
const bannerRoutes = require('./bannerRoutes.js')
const searchRoutes = require('./searchRoutes.js')
const accountRoutes = require('./accountRoutes.js')
const cartRoutes = require('./cartRoutes.js')
const orderRoutes = require('./orderRoutes.js')
const employeeAdminRoutes = require('./employeeAdminRoutes.js')
const Banners = require('../models/Banners.js')
const orderAdminRoutes = require('./orderAdminRoutes.js')
const profileAdminRoutes = require('./profileAdminRoutes.js')
const reviewRoutes = require('./reviewRoutes.js')
const brandRoutes = require('./brandRoutes.js')

const profileShipperRoutes = require('./shipper/profileShipperRoutes.js')

router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/banners', bannerRoutes)
router.use('/searchs', searchRoutes)
router.use('/accounts', accountRoutes)
router.use('/carts', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/reviews', reviewRoutes)
router.use('/brands', brandRoutes)
//ADMIN
router.use('/admin/employees', employeeAdminRoutes)
router.use('/admin/orders', orderAdminRoutes)
router.use('/admin/profile', profileAdminRoutes)

//SHIPPER
router.use('/shipper/profile', profileShipperRoutes)

module.exports = router