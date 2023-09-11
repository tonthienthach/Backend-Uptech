const Users = require('../models/Users');
const mongoose = require('mongoose');
const Carts = require('../models/Carts');
// const createToken = require('../middlewares/createToken')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
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
    async getAccount(req, res, next) {
        console.log(req.user)
        const userID = req.user._id
        await Users.findOne({_id:userID})
            .then((users) => {
                console.log(users)
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
    //    "_pw": "17Tcn9921%" 
    // }
    signUp = async (req, res, next) => {

        // Hash the password with the generated salt
        // Generate a salt to hash the password
        const saltRounds = 10;
        let password = req.body._pw
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return res.status(500).json({ error: 'Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!' });
            }
            // Hash the password with the generated salt
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 'Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!' });
                }

                // Create a new user document with the hashed password
                const newUser = {
                    _id: new mongoose.Types.ObjectId(),
                    _fname: req.body._fname,
                    _lname: req.body._lname,
                    _email: req.body._email,
                    _pw: hash,
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
            });
        });




    }

    // log in
    // api/accounts/login
    // body: {
    //    "_email": "lamanh@gmail.com",
    //    "_pw": "17Tcn940282$" 
    // }
    logIn = async (req, res, next) => {
        const user = {
            _email: req.body._email,
            _pw: req.body._pw
        }

        try {
            const auth = await Users.findOne({ _email: user._email })
            if (auth) {

                // Compare the entered password with the stored hash
                const passwordMatch = await bcrypt.compare(user._pw, auth._pw);

                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Đăng nhập thất bại, mật khẩu sai không chính xác!' });
                }
                //Tạo token ở đây
                let token = createToken(auth._id)
                res.status(200).json({
                    message: "Đăng nhập thành công!",
                    token: token
                })
            }
            else {
                res.status(400).json({
                    message: "Không tìm thấy email!"
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