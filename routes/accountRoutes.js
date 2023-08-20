const express = require('express')
const router = express.Router()
const Users = require('../models/Users');
const accountController = require('../controllers/accountsController')


router.get('/', accountController.getAllAccounts)


module.exports = router