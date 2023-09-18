const mongoose = require('mongoose');
const Categories = require('../models/Categories')
const Products = require('../models/Products');

class categoriesController {
    // api/categorys (get all categorys)
    getAllCategories(req, res, next) {
        Categories.find({ _status: true })
            .then((Categories) => {
                res.json(Categories);
            })
            .catch(next);
    }

    getProductsByCategory = async (req, res) => {
        try {
            const { categoryId } = req.query;
            console.log(categoryId)
            const listProduct = await Products.find({ _categoryId: categoryId }); // Sửa '_Items' thành '_items'
            console.log(listProduct)
            if (!listProduct) {
                return res.status(404).json({ message: 'Không tìm thấy categoryId' });
            }    
            res.json(listProduct);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm.' });
        }
    };

   
}

module.exports = new categoriesController