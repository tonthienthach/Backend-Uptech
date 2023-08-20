// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const searchController = require('../controllers/SearchController');

router.get('/:id', productController.get);
module.exports = router;
