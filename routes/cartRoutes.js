// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartsController');
const verifyToken = require('../middlewares/verifyToken'); 

router.get('/',verifyToken, cartController.getCart);
router.put('/:slug/add-to-cart', cartController.addToCart);


module.exports = router
