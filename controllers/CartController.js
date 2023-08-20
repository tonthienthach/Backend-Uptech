// controllers/cartController.js
const Cart = require('../models/Carts'); // Đường dẫn đến model Cart
const Products = require('../models/Products'); // Đường dẫn đến model Product

exports.get = async (req, res) => {
  try {
    const { userId } = req.query;
    const cart = await Cart.findOne({ uId: userId }).populate('_cartItems.itemId');

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho user ID này.' });
    }    
    res.json(cart);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin giỏ hàng.' });
  }
};
