const Product = require('../models/Products')

class searchController {
    getSearch = async (req, res) =>{
        try {
            const {q} = req.query;
            const products = await Product.find({_name: { $regex: q, $options: 'i'}}).limit(7);
            res.json(products);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Lỗi trong quá trình truy vấn sản phẩm' });
        }
    }
}

module.exports = new searchController();
