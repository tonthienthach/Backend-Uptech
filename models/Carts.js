const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _cartItems: Array,
    uId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});

const Carts = mongoose.model('carts', cartSchema);
module.exports = Carts;