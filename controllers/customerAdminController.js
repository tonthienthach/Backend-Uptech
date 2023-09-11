const Customers = require('../models/Users');

class CustomerAdminController {

    async getAllCustomers(req, res) {
        try {
            const query = { _role:"customer" };
            const customers = await Customers.find(query);
            res.json(customers);
        }
        catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khách hàng.' });
        }

        
    }
    async hideCustomer (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const result = await Customers.updateOne(query, {$set: {_status: false}});
            res.json(result.matchedCount);
        }
        catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khách hàng.' });
        }
    }

    async activeCustomer (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const result = await Customers.updateOne(query, {$set: {_status: true}});
            res.json(result.matchedCount);
        }
        catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khách hàng.' });
        }
    }

    async getCustomer (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const result = await Customer.findOne(query);
            res.json(result);
        }
        catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nhân viên.' });
        }
    }
}

module.exports = new CustomerAdminController