const Users = require('../models/Users');
const mongoose = require('mongoose');
const Carts = require('../models/Carts');
class UsersController {

    async getAllAccounts(req, res, next) {
        await Users.find({})
            .then((users) => {
                res.json(users);
            })
            .catch(next);

    }

    //sign up
    // api/accounts/signup
    // body: {
    //    "_fname":"chau anh",
    //    "_lname":"nguyen kieu",
    //    "_email": "nguyenkieu@gmail.com",
    //    "_role":"customer",
    //    "_password": "17Tcn9921%" 
    // }
    signUp = async (req, res, next) => {
        const newUser = {
            _id: new mongoose.Types.ObjectId(),
            _fname: req.body._fname,
            _lname: req.body._lname,
            _email: req.body._email,
            _pw: req.body._pw,
            _role: "customer"
        }
        try {
            const email = await Users.findOne({ _email: newUser._email })
            if (!email) {
                await Users.create(newUser)
                await Carts.create({
                    uId: newUser._id,
                    _cartItems: []
                })
                res.status(201).json({
                    message: "Đăng ký tài khoản mới thành công!"
                })
            }
            else {
                res.status(400).json({
                    message: "Email này đã được đăng ký, vui lòng dùng email khác!",
                    data: {
                        email: newUser._email
                    }
                })
            }

        }
        catch (err) {
            res.status(400).json({
                message: err.message
            })
        }

    }
}

module.exports = new UsersController