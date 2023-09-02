const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./Users')
const Products = require('./Products')

// Định nghĩa schema cho mục trong giỏ hàng (_cartItems)
const ItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: Products,
    required: true,
    unique: true
  },
  quantity: {
    type: String,
    required: true,
    min: [1, 'Số lượng không được ít hơn 1.']
  },
  _id: {
    type: Schema.Types.ObjectId,
    ref: Products,

    unique: true
  }
});

// Định nghĩa schema cho collection "carts"
const cartSchema = new Schema({
  _id: Schema.Types.ObjectId,
  _cartItems: [ItemSchema],
  uId: {
    type: Schema.Types.ObjectId,
    ref: Users,
    required: true
  },
  _name: String
});

// Tạo model "Carts" dựa trên schema "cartSchema"
const Carts = mongoose.model('carts', cartSchema);
module.exports = Carts;


