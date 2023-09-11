const express = require('express')
const router = express.Router()
const Users = require('../models/Users');
const accountController = require('../controllers/accountsController')
const verifyToken = require('../middlewares/verifyToken');

router.get('/', accountController.getAllAccounts)
router.get('/user', verifyToken,accountController.getAccount) 
router.post('/signup', accountController.signUp)
router.post('/login', accountController.logIn)

module.exports = router