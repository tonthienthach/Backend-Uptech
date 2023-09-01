const mongoose = require('mongoose');
const Users = require('./Users');
const Products = require('./Products');

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _content: String,
    _rating: String,
    _uId: { type: mongoose.Schema.Types.ObjectId, ref: Users },
    _pId: { type: mongoose.Schema.Types.ObjectId, ref: Products },
    _images: Array

});

const Reviews = mongoose.model('reviews', reviewSchema);
module.exports = Reviews;