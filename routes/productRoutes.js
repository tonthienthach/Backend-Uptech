const express = require('express')
const router = express.Router()
const Products = require('../models/Products');
const productsController = require('../controllers/productsController')


router.get('/', productsController.getAllProducts)
router.get('/:slug', productsController.getProduct)

module.exports = router
