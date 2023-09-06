const express = require('express')
const router = express.Router()
const orderController = require('../controllers/ordersController')

router.get('/', orderController.getOrder);
router.post('/create', orderController.placeOrder);
router.post('/vnpayCreatePayment',orderController.vnpayCreatePayment)
router.get('/vnpayIPN',orderController.vnpayIPN)
router.get('/vnpayReturn', orderController.vnpayReturn)
module.exports = router