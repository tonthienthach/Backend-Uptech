const Orders = require('../models/Orders');
const mongoose = require('mongoose');


class OrdersAdminController {
    async getAllOrders(req, res){
        try {
            const orders = await Orders.find({});
            res.json(orders);
        }
        catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng'});
        }
    }
    async getOrder(req, res) {
        try {
            const slugObjectId = new mongoose.Types.ObjectId(req.params.slug);
            const query = {_id : slugObjectId};
            const order = await Orders.findOne(query);
            res.json(order);
        }
        catch (error) {
            console.error('Lỗi khi lấy đơn hàng!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi lấy đơn hàng'});
        }
    }
    
}

module.exports = new OrdersAdminController