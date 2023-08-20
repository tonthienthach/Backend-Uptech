// controllers/productController.js
const Product = require('../models/Products'); // Đường dẫn đến model Products

// tìm kiếm sản phẩm theo tên
exports.get = async (req, res) => {
    try {
        const { q } = req.query;
        const products = await Product.find({ _name: { $regex: q, $options: 'i' } }).limit(5);
        console.log(q)
        console.log(products)
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Lỗi trong quá trình truy vấn sản phẩm' });
    }
};