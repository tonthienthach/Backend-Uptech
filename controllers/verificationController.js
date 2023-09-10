const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


class verificationController {
    verificationCode = ''
    sendMail = (req, res, verificationCode) => {

        const { userEmail } = req.body;

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
            return res.status(201).json({
                msg: "Check your email to receive OTP!",
                OTP: verificationCode
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
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

    verifyOTP = (req, res) => {
        const { otp } = req.body

        try {
            if (otp === this.verificationCode) {
                res.status(200).json({
                    message: 'Xác thực OTP thành công!'
                })
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
                message: 'Có lỗi xảy ra trong quá trình xác thực OTP!',
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