// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/get-cart', cartController.get);

module.exports = router;
