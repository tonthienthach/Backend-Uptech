const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _name: String

});

const Banners = mongoose.model('banners', bannerSchema);
module.exports = Banners;