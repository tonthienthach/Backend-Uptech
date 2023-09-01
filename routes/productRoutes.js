const express = require('express')
const router = express.Router()
const Products = require('../models/Products');
const productsController = require('../controllers/productsController')

//tham khảo lỗi:  Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
//https://www.reddit.com/r/node/comments/y4w0wq/help_argument_passed_in_must_be_a_string_of_12/ 
router.get('/', productsController.getAllProducts)
router.get('/mostSearched', productsController.getMostSearched)
router.get('/onSale', productsController.getOnSale)
router.get('/bestSelling', productsController.getBestSelling)
router.get('/related_products/:slug', productsController.getReLatedProducts)
router.get('/:slug', productsController.getProduct)


module.exports = router
