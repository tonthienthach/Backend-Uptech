const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _name: String

});

const Brands = mongoose.model('brands', brandSchema);
module.exports = Brands;
