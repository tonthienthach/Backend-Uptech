const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho mục trong giỏ hàng (_cartItems)
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

// Định nghĩa schema cho collection "carts"
const cartSchema = new Schema({
  _id: Schema.Types.ObjectId,
  _cartItems: [ItemSchema],
  uId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

// Tạo model "Carts" dựa trên schema "cartSchema"
const Carts = mongoose.model('carts', cartSchema);

module.exports = Carts;
