const mongoose = require('mongoose');
const { Schema } = mongoose;
const Categories = require('./Categories');
const Brands = require('./Brands')

const productSchema = new mongoose.Schema({
    // _id: {
    //     type: Schema.Types.ObjectId
    // },
    _name: String,
    _brandId: {
        type: Schema.Types.ObjectId,
        ref: Brands
    },
    _categoryId: {
        type: Schema.Types.ObjectId,
        ref: Categories // Referencing the 'Category' model
    },
    _detail: String,
    _images: Array,
    _name: String,
    _price: Schema.Types.Number,
    _quantity: String,
    _salePercent: Schema.Types.Number,
    _sold: Schema.Types.Number,
    _status: Boolean,
    _clickCount: Schema.Types.Number

});

const Products = mongoose.model('products', productSchema);
module.exports = Products;
