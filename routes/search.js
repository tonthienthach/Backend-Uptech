// routes/products.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

router.get('/get-product', searchController.get);
module.exports = router;
