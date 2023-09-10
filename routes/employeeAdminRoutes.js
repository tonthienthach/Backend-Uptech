const express = require('express');
const router = express.Router();
const employeesAdminController = require('../controllers/employeeAdminController');

router.get('/', employeesAdminController.getAllEmployees);
router.get('/employee/', employeesAdminController.getEmployee);
router.put('/delete/', employeesAdminController.deteleEmployee);
router.post('/add', employeesAdminController.addEmployee);
module.exports = router