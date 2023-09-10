const Employees = require('../models/Users');

class EmployeeAdminController {

    async getAllEmployees(req, res) {
        try {
            const query = { _role:"shipper", _status: true };
            const employees = await Employees.find(query);
            res.json(employees);
        }
        catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách nhân viên.' });
        }

        
    }
    async deteleEmployee (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const result = await Employees.updateOne(query, {$set: {_status: false}});
            res.json(result.matchedCount);
        }
        catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nhân viên.' });
        }
    }

    async getEmployee (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const result = await Employees.findOne(query);
            res.json(result);
        }
        catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nhân viên.' });
        }
    }

    async addEmployee (req, res) {
        try {
            const data = req.body;
            console.log(data);
            const result = await Employees.insertMany(data);
            res.json(result);
            
        }catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm nhân viên.' });
        }
    }
}

module.exports = new EmployeeAdminController