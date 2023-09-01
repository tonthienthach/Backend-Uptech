const express = require('express');
const router = express.Router();
const employeesAdminController = require('../controllers/employeeAdminController');

router.get('/', employeesAdminController.getAllEmployees);

module.exports = router