// controllers/productController.js
const Product = require('../models/Products'); // Đường dẫn đến model Products

exports.get = async (req, res, next) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        res.send(product)
    } catch (error) {
        console.log(error.message)
    }
}
