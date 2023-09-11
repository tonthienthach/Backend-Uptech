const express = require('express')
const router = express.Router()
const Users = require('../models/Users');
const accountController = require('../controllers/accountsController')
const verifyToken = require('../middlewares/verifyToken');

router.get('/', accountController.getAllAccounts)
router.get('/user', verifyToken,accountController.getAccount) 
router.post('/signup', accountController.signUp)
router.post('/login', accountController.logIn)
router.post('/adminLogin', accountController.adminLogIn)
router.post('/shipperLogin', accountController.shipperLogIn)

module.exports = router