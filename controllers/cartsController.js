const Cart = require('../models/Carts');
const mongoose = require('mongoose');

class CartsController {
    // api/carts (get all carts)
    getCart = async (req, res) => {
        try {
            const cart = await Cart.findOne({ uId: req.user._id });
            if (!cart) {
                return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho user ID này.' });
            }
            res.json(cart);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin giỏ hàng.' });
        }
    };
    // api/carts/delete-cart

    deleteCart = async (req, res) =>{
        try {
            // Lấy ID sản phẩm cần xóa từ request body hoặc params, tùy theo cách bạn truyền ID trong yêu cầu của bạn.
            const itemIdToDelete = req.body.itemId || req.params.itemId;
            // Tìm giỏ hàng của người dùng dựa trên uId và ID sản phẩm cần xóa.
            const cart = await Cart.findOneAndUpdate(
                { uId: req.user._id },
                { $pull: { _cartItems: { itemId: itemIdToDelete } } },
                { new: true }
            );    
            if (cart) {
                // Nếu sản phẩm đã được xóa khỏi giỏ hàng thành công, trả về thông báo thành công và giỏ hàng đã được cập nhật.
                return res.status(200).json({
                    message: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
                    data: {
                        updatedCart: cart
                    }
                });
            } else {
                // Nếu không tìm thấy giỏ hàng hoặc sản phẩm, trả về thông báo lỗi.
                return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng.' });
            }
        } catch (error) {
            // Xử lý lỗi và trả về thông báo lỗi.
            console.error(error);
            return res.status(500).json({ message: 'Lỗi trong quá trình xóa sản phẩm khỏi giỏ hàng.', error: error.message });
        }
    }



    // api/cart/add-to-cart
    addToCart = async (req, res, next) => {

        await Cart.init()
        try {
            const cart = await Cart.findOneAndUpdate({ uId: req.user._id, "_cartItems.itemId": { $ne: req.body.itemId } }, {
                $addToSet: {
                    _cartItems: req.body
                },
            },
                { new: true }
            )
            //Nếu sản phẩm chưa có trong giỏ hàng thì thêm vào giỏ
            if (cart) {
                await cart.save()
                res.status(200).json(
                    {
                        message: 'Success',
                        data: {
                            updatedCart: cart
                        }
                    }
                )
            }
            //Nếu sản phẩm đã có sẵn trong giỏ hàng thì chỉ cập nhật số lượng
            else {
                const cart = await Cart.findOneAndUpdate({ uId: req.user._id, "_cartItems.itemId": { $eq: req.body.itemId } },
                    { $inc: { "_cartItems.$.quantity": req.body.quantity } }, {
                    new: true
                })  
                if (cart) {
                    res.json({
                        message: 'Item already existed so only  updating quantity!',
                        data: {
                            updatedCart: cart
                        }

                    })
                }

            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error adding item to cart', error: error.message });
        }
    }
}

module.exports = new CartsController();
