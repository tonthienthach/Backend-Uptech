const Orders = require('../models/Orders');


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
            const {orderId} = req.query;
            const order = await Orders.findOne({_id: orderId});
            res.json(order);
        }
        catch (error) {
            console.error('Lỗi khi lấy đơn hàng!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi lấy đơn hàng'});
        }
    }
    async updateOrder(req, res) {
        try {
            const {orderId} = req.query;
            const query = {_id: orderId};
            const data = req.body;
            console.log(data);
            const updateData = {$set: {_status:data._status}};
            const result = await Orders.updateOne(query, updateData);
            res.json(result.matchedCount);
        }catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi cập nhật đơn hàng'});
        }
    }
    
}

module.exports = new OrdersAdminController