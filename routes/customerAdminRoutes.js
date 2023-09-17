const express = require('express');
const router = express.Router();
const customersAdminController = require('../controllers/customerAdminController');

router.get('/', customersAdminController.getAllCustomers);
router.get('/:slug', customersAdminController.getCustomer);
router.put('/hide/', customersAdminController.hideCustomer);
router.put('/active/', customersAdminController.activeCustomer);
module.exports = router