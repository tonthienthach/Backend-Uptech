const express = require('express')
const router = express.Router()
const reviewControlellers = require('../controllers/reviewController.js');

router.get('/:slug', reviewControlellers.getAProductReviews)


module.exports = router


