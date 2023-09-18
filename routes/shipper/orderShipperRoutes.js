const express = require('express');
const router = express.Router();
const ordersShipperController = require('../../controllers/shipper/ordersShipperController');

router.get('/', ordersShipperController.getAllOrders);
router.get('/shipper/', ordersShipperController.getShipperOrders);
router.get('/order-detail/', ordersShipperController.getOrder);
router.put('/update-order/', ordersShipperController.updateOrder);
router.put('/comfirm-order/', ordersShipperController.comfirmOrder);

module.exports = router