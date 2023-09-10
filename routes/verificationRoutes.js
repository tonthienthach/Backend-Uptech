const express = require('express')
const router = express.Router()
const verificationController = require('../controllers/verificationController.js')

router.post('/send-mail', verificationController.sendOTP)
router.post('/verifyOTP', verificationController.verifyOTP)

module.exports = router
