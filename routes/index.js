const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewares/verifyToken');

// const usersRoutes = require('./users');
const productsRoutes = require('./products');
// const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');
const searchRoutes = require('./search');
/* GET home page. */
router.get('/', function (req, res, next) {
  return res.json({ message: 'welcome to homepage' });
});


// router.use('/user', usersRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/search', searchRoutes);
// router.use('/orders', config.jwtMiddleware, ordersRoutes);

module.exports = router;
