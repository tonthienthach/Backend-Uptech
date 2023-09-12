const express = require('express')
const router = express.Router()
const reviewControlellers = require('../controllers/reviewController.js');
const verifyToken = require('../middlewares/verifyToken')

router.get('/:slug', reviewControlellers.getAProductReviews)
router.post('/post-new-comment', verifyToken, reviewControlellers.postNewComment)

module.exports = router


