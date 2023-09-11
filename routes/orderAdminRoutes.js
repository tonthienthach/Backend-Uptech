const express = require('express');
const router = express.Router();
const ordersAdminController = require('../controllers/ordersAdminController');

router.get('/', ordersAdminController.getAllOrders);
router.get('/order-detail/', ordersAdminController.getOrder);
router.put('/update-order/', ordersAdminController.updateOrder);

module.exports = router