const express = require('express')
const router = express.Router()
const orderController = require('../controllers/ordersController')

router.get('/', orderController.getOrder);
router.post('/create', orderController.placeOrder);
router.post('/create_payment_url',orderController.vnpayCreatePayment)
router.get('/vnpay_ipn',orderController.vnpayIPN)
router.get('/vnpay_return', orderController.vnpayReturn)
module.exports = router