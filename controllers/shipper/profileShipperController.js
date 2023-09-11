const Users = require('../../models/Users');
const mongoose = require('mongoose');

class ProfileShipperController {
    async getUser(req, res) {
        try {
            const slugObjectId = new mongoose.Types.ObjectId(req.params.slug);
            const query = {_id : slugObjectId};
            const user = await Users.findOne(query);
            res.json(user);
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
    
}

module.exports = new ProfileShipperController