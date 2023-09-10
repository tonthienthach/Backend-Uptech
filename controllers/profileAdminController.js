const Users = require('../models/Users');
const mongoose = require('mongoose');

class ProfileAdminController {
    async getUser(req, res) {
        try {
            const {userId} = req.query;
            const query = {_id : userId};
            const user = await Users.findOne(query);
            res.json(user);
        }

        catch (error) {
            console.error('Lỗi khi lấy thông tin!');
            res.status(500).json({error: 'Đã xảy ra lỗi khi lấy thông tin'});
        }
    }

    async updateProfile(req, res) {
        try {
            const data = req.body;
            const {userId} = req.query;
            const query = {_id: userId};
            console.log(data);
            console.log(userId);
            const updateData = {$set: {_fname: data._fname, 
                                        _lname: data._lname, 
                                        _phones: data._phones, 
                                        _email: data._email,
                                        _dateOfBirth: data._dateOfBirth,
                                        _gender: data._gender,
                                        _addresses: data._addresses}};
            
            const result = await Users.updateOne(query, updateData);
            
            res.json(result.matchedCount);

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin cá nhân');
            res.status(500).json({error: 'Đã xảy ra lỗi khi cập nhật thông tin cá nhân'});
        }
    }
    async changePassword (req, res) {
        try {
            const {userId} = req.query;
            const query = {_id: userId};
            const data = req.body;
            const updatePassword = {$set: {_pw: data._pw}}
            const result = await Users.updateOne(query, updatePassword);
            res.json(result.matchedCount);
        } catch (error) {
            console.error('Lỗi khi cập nhật mật khẩu');
            res.status(500).json({error: 'Đã xảy ra lỗi khi cập nhật mật khẩu'});
        }
    }
    
    
}

module.exports = new ProfileAdminController