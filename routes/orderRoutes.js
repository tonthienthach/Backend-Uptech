const express = require('express')
const router = express.Router()
const orderController = require('../controllers/ordersController')
const verifyToken = require('../middlewares/verifyToken'); 

router.get('/', orderController.getOrder);
router.post('/create',verifyToken, orderController.placeOrder);
router.post('/vnpayCreatePayment',orderController.vnpayCreatePayment)
router.get('/vnpayIPN',orderController.vnpayIPN)
router.get('/vnpayReturn', orderController.vnpayReturn)
module.exports = router