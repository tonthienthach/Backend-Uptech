const Employees = require('../models/Users');

class EmployeeAdminController {

    async getAllEmployees(req, res) {
        try {
            const query = { _role:"shipper" };
            const employees = await Employees.find(query);
            res.json(employees);
        }
        catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách nhân viên.' });
        }

        
    }
}

module.exports = new EmployeeAdminController