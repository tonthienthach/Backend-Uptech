const Cart = require('../models/Carts');
const mongoose = require('mongoose');



class CartsController {
    // api/carts (get all carts)
    getCart = async (req, res) => {
        try {
            const userId = req.user._id;
            const cart = await Cart.findOne({ uId: userId });
            if (!cart) {
                return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho user ID này.' });
            }
            res.json(cart);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin giỏ hàng.' });
        }
    };



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
