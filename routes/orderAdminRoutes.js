const express = require('express');
const router = express.Router();
const ordersAdminController = require('../controllers/ordersAdminController');

router.get('/', ordersAdminController.getAllOrders);
router.get('/:slug', ordersAdminController.getOrder);

module.exports = router