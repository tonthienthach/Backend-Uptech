const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _address: String,
    _items: Array,
    _name: String,
    _phone: String,
    _status: String,
    _totalPayment: String,
    _uId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    _shippingFee: String

});

const Banners = mongoose.model('banners', bannerSchema);
module.exports = Banners;