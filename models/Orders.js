const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho mục trong order (_Items)
const ItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: String,
    required: true,
    min: [1, 'Số lượng không được ít hơn 1.']
  }
});
const ordersSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  _address: String,
  _name: String,
  _phone: String,
  _status: Number,
  _totalPayment: Number,
  _uId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Đảm bảo rằng collection là 'users' hoặc 'Users' tùy theo cấu hình thực tế của bạn.
  _shippingFee: Number,
  _items: [ItemSchema]
});

const Orders = mongoose.model('orders', ordersSchema);
module.exports = Orders;