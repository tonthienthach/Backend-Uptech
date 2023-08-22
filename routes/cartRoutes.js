// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartsController');

router.get('/', cartController.getCart);


module.exports = router
