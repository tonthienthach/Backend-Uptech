const express = require('express')
const router = express.Router()
const brandsController = require('../controllers/brandsController.js')

router.get('/', brandsController.getAllBrands)

module.exports = router
