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
    
}

module.exports = new ProfileShipperController