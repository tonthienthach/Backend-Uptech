const Users = require('../models/Users');
const mongoose = require('mongoose');
const Carts = require('../models/Carts');
// const createToken = require('../middlewares/createToken')
const jwt = require('jsonwebtoken')

const createToken = (_uId) => {
    return jwt.sign({ _id: _uId, role: "customer" }, process.env.SECRET_KEY, { expiresIn: '3d' })
}

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
            _role: "customer",
            _phones: [],
            _dateOfBirth: new Date(),
            _gender: '',
            _avatar: ''
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

    // log in
    // api/accounts/login
    // body: {
    //     "_email": "nguyenkieuchauanh0908@gmail.com",
    //     "_pw": "chauanh0908@T"
    // }
    logIn = async (req, res, next) => {
        const user = {
            _email: req.body._email,
            _pw: req.body._pw
        }
        try {
            const auth = await Users.findOne({ _email: user._email, _pw: user._pw })
            if (auth) {
                //Tạo token ở đây
                let token = createToken(auth._id)
                res.status(200).json({
                    message: "Đăng nhập thành công!",
                    token: token
                })
            }
            else {
                res.status(400).json({
                    message: "Email hoặc mật khẩu không đúng!",
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