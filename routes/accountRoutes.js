const express = require('express')
const router = express.Router()
const Users = require('../models/Users');
const accountController = require('../controllers/accountsController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', accountController.getAllAccounts)
router.post('/signup', accountController.signUp)
router.post('/login', accountController.logIn)
router.post('/adminLogin', accountController.adminLogIn)
router.post('/shipperLogin', accountController.shipperLogIn)
router.post('/resetPasswordForCustomers', accountController.resetPasswordForCustomers)
router.get('/getProfile', verifyToken, accountController.getProfile)
router.put('/updateProfile', verifyToken, accountController.updateProfile)
router.put('/changePassWord', verifyToken, accountController.changePassWord)
module.exports = router