const express = require('express')
const router = express.Router()
const verificationController = require('../controllers/verificationController.js')

router.post('/send-otp', verificationController.sendOTP)
router.post('/user-reset-password', verificationController.resetPassWordByOTPForUsers)
router.post('/shipper-reset-password', verificationController.resetPassWordByOTPForShippers)

module.exports = router
