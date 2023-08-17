const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _name: String

});

const Categories = mongoose.model('categories', categorySchema);
module.exports = Categories;
