const Cart = require('../models/Carts');
class CartsController {
    // api/carts (get all carts)
    getCart = async (req, res) => {
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
}

module.exports = new CartsController();
