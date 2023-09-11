const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const createToken = require('../middlewares/createToken')
const Users = require('../models/Users');
const bcrypt = require('bcrypt')

class verificationController {
    verificationCode = ''
    sendMail = async (req, res, verificationCode) => {

        const { userEmail } = req.body;
        try {
            const user = await Users.findOne({ _email: userEmail });
            if (user) {
                let config = {
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                }

                let transporter = nodemailer.createTransport(config);

                let MailGenerator = new Mailgen({
                    // theme: "default",
                    product: {
                        name: "team2-eWeb",
                        link: 'https://mailgen.js/'
                    }
                })

                let response = {
                    body: {
                        intro: 'Đây là mã xác nhận để đổi mật khẩu! Vui lòng không chia sẻ mã này với ai!',
                        action: {
                            instructions: 'Mã xác nhận của bạn là:',
                            button: {
                                color: '#22BC66',
                                text: verificationCode
                            }
                        },
                        outro: 'Mã sẽ hết tác dụng trong vòng 2 phút!'
                    }
                };
                let mail = MailGenerator.generate(response)

                let message = {
                    from: process.env.EMAIL,
                    to: userEmail,
                    subject: "Verification Code",
                    html: mail
                }
                transporter.sendMail(message).then(() => {
                    //let token = createToken(auth, '120')
                    return res.status(201).json({
                        message: "Kiểm tra email để nhận OTP!",
                        OTP: verificationCode,
                        // token: token

                    })
                }).catch(error => {
                    return res.status(500).json({ error })
                })
            }
            else {
                res.status(400).json({
                    message: 'Vui lòng dùng email đã đăng ký tài khoản'
                })
            }
        }
        catch (err) {
            res.status(400).json({
                message: 'Đã có lỗi xảy ra trong quá trình gửi mã OTP!',
                error: err
            })
        }

    }

    generateRandomNumberString = (req, res) => {
        let result = '';
        const characters = '0123456789';
        const length = 6;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    resetPassWordByOTPForUsers = async (req, res) => {
        const { otp, email, password, rePassword } = req.body

        try {
            if (otp === this.verificationCode) {
                if (rePassword === password) {
                    try {
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, (err, salt) => {
                            if (err) {
                                return res.status(500).json({ error: 'Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!' });
                            }
                            // Hash the password with the generated salt
                            bcrypt.hash(password, salt, async (err, hash) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Xảy ra lỗi trong quá trình mã hóa mật khẩu!' });
                                }
                                const user = await Users.findOneAndUpdate({ _email: email, _role: "customer" }, {
                                    _pw: hash
                                }, { new: true })

                                if (user) {
                                    res.status(200).json({
                                        message: 'Reset mật khẩu thành công!',
                                        newPassword: hash
                                    })
                                }
                                else {
                                    res.status(200).json({
                                        message: 'Reset mật khẩu thất bại!',
                                        newPassword: hash
                                    })
                                }

                            });
                        });

                    }
                    catch (error) {
                        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình reset mật khẩu!', error: error.message });
                    }
                }
                else {
                    res.status(400).json({ message: 'Mật khẩu nhập lại không trùng khớp!', error: error.message });
                }
            }
            else {
                res.status(404).json({
                    message: 'OTP không trùng khớp, xác thực thất bại!!',
                    // verificationCode: this.verificationCode,
                    // OTP: otp
                })
            }
        }
        catch (err) {
            res.status(404).json({
                message: 'OTP hết hiệu lực!',
                lỗi: err.message
            })
        }

    }

    sendOTP = (req, res) => {
        this.verificationCode = this.generateRandomNumberString()
        this.sendMail(req, res, this.verificationCode)
        //Xóa OTP sau 2 phút
        setTimeout(() => {
            this.verificationCode = ''
        }, 2 * 60 * 1000);

    }


}

module.exports = new verificationController