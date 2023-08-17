const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    _name: String,
    _brandId: {
        type: Schema.Types.ObjectId,
        ref: 'Brands'
    },
    _categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Categories' // Referencing the 'Category' model
    },
    _detail: String,
    _images: Array,
    _name: String,
    _price: String,
    _quantity: String,
    _salePercent: String,
    _sold: String,
    _status: String, //Selling - Not Selling

});

const Products = mongoose.model('products', productSchema);
module.exports = Products;
