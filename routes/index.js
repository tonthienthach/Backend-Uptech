
const express = require('express')
const router = express.Router()
const productRoutes = require('./productRoutes.js')
const categoryRoutes = require('./categoryRoutes.js')
const otherRoutes = require('./otherRoutes.js')
const searchRoutes = require('./searchRoutes.js')
const accountRoutes = require('./accountRoutes.js')
const cartRoutes = require('./cartRoutes.js')
const employeeAdminRoutes = require('./employeeAdminRoutes.js')
const Banners = require('../models/Banners.js')
const orderAdminRoutes = require('./orderAdminRoutes.js')
const profileAdminRoutes = require('./profileAdminRoutes.js')

router.use('/products', productRoutes)
router.use('/categories',categoryRoutes)
router.use('/banners', otherRoutes)
router.use('/searchs', searchRoutes)
router.use('/accounts', accountRoutes)
router.use('/carts', cartRoutes)

//ADMIN
router.use('/admin/employees', employeeAdminRoutes)
router.use('/admin/orders', orderAdminRoutes)
router.use('/admin/profile', profileAdminRoutes)


module.exports = router