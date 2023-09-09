const Products = require('../models/Products');
const mongoose = require('mongoose');

class ProductsController {

    // VD: http://localhost:5000/api/products/64baace76d2d02c254dc7afb
    getProduct(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.pid)
        Products.findOne({ _id: slugObjectId }).populate('_brandId', '_name')
            .then((product) => {
                res.json(product);
            })
            .catch(next)
    }


    // api/products 
    getAllProducts(req, res, next) {
        Products.find({})
            .then((products) => {
                res.json(products);
            })
            .catch(next);

    }

    // api/products/bestSelling
    getBestSelling(req, res, next) {
        Products.find().sort({ _sold: -1 }).populate('_brandId', '_name').limit(10)
            .then(products => {
                res.json(products)
            })
            .catch(next)
    }

    // api/products/onSale
    getOnSale(req, res, next) {
        Products.find({ _salePercent: { $gt: 0 }, _status: true }).populate('_brandId', '_name').limit(10)
            .then(products => {
                res.json(products)
            })
            .catch(next)
    }

    // api/products/mostSearched
    getMostSearched(req, res, next) {
        Products.find().sort({ _clickCount: -1 }).populate('_brandId', '_name').limit(10)
            .then(products => {
                res.json(products)
            })
            .catch(next)

    }

    // get related products
    // api/products/related_products/64b6377e850413a49cf46632
    getReLatedProducts(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Products.find({ _categoryId: slugObjectId }).populate('_brandId', '_name').limit(6)
            .then((product) => {
                res.json(product);
            })
            .catch(next)
    }

    // get products of a brand
    // api/products?brandId=64b8b8bda77410c2079d22e8
    getProductsByParam = async (req, res, next) => {
        try {
            let categoryId = ''
            let brandId = ''
            categoryId = req.query.categoryId;
            brandId = req.query.brandId;
            let products = await Products.find({ $or: [{ _categoryId: categoryId }, { _brandId: brandId }, {}] }).populate('_brandId', '_name')
            if (!products) {

                res.status(400).json({
                    message: "Xảy ra lỗi trong quá trình tìm kiếm!"
                })
            }
            res.json(products);
        }
        catch (err) {
            res.status(400).json({
                message: err.message
            })
        }

    }

    //update clickCount of a product
    //api/products?clickCount=1
    updateClickCount = async (req, res, next) => {
        const clickCount = 1
        const pId = req.query.pId
        try {
            const product = await Products.findOneAndUpdate({ _id: pId },
                { $inc: { "_clickCount": clickCount } },
                { new: true })
            if (product) {
                res.status(200).json(
                    {
                        message: 'Cập nhật clickCount thành công!',
                        //data: product
                    }
                )
            }
            else {
                res.status(400).json({
                    message: 'Cập nhật clickCount thất bại!'
                })
            }
        }
        catch (err) {
            res.status(400).json({
                message: 'Cập nhật clickCount thất bại!',
                error: err.message
            })
        }

    }

}

module.exports = new ProductsController