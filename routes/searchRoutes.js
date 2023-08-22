const express = require('express')
const router = express.Router()
const searchController = require('../controllers/searchsController');

router.get('/', searchController.getSearch);
module.exports = router