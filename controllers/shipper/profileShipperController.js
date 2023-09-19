const Users = require('../../models/Users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');

class ProfileShipperController {
    
    async getUser(req, res, next) {
        const { _id, _role } = req.user
        try {
            const user = await Users.findOne({ _id: _id, _role: _role })
            if (user) {
                res.json(user);
            }
        }

        catch (error) {
            console.error('Lỗi khi lấy thông tin!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi lấy thông tin'});
        }
    }

    async editProfile(req, res) {
        try {
            const data = req.body;
            const {userId} = req.query;
            const query = {_id : userId};
            console.log(data);
            console.log(query);
            const update = { 
                $set:{
                    _fname: req.body._fname,
                    _lname: req.body._lname,
                    _avatar: req.body._avatar,
                    _gender: req.body._gender,
                    _dateOfBirth: req.body._dateOfBirth,
                }
            };
            const user = await Users.updateOne(query, update);
            res.json(user.matchedCount);
        }

        catch (error) {
            console.error('Lỗi khi cập nhật thông tin!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi cập nhật thông tin'});
        }
    }

    checkPassWord = async (req, res, next) => {
        const { oldPassword, id } = req.body
        try {
            const user = await Users.findOne({ _id: id , _role: 'shipper'})
            if (user) {
                try {
                    const passwordMatch = await bcrypt.compare(oldPassword, user._pw);
                    if (!passwordMatch) {
                        res.status(400).json({
                            message: 'Mật khẫu cũ bị sai!',
                        })
                    }
                    else {
                        res.status(200).json({
                            message: 'đúng',
                        })
                    }
                }
                catch (e) {
                    res.status(400).json(
                        {
                            message: 'Kiểm tra thất bại!',
                            error: e.message
                        }

                    )
                }
            }
            else {
                res.status(400).json({
                    message: 'Kiểm tra thất bại, không tìm thấy user!'
                })
            }
        } catch (err) { }



    }
    
}

module.exports = new ProfileShipperController