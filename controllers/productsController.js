const Products = require('../models/Products');
const mongoose = require('mongoose');

class ProductsController {

    // api/:slug
    // VD: http://localhost:5000/api/products/64b6367474e10f82ea5c17d7
    getProduct(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
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

    //get related products
    // api/products/related_products/64b6377e850413a49cf46632
    getReLatedProducts(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Products.find({ _categoryId: slugObjectId }).populate('_brandId', '_name').limit(6)
            .then((product) => {
                res.json(product);
            })
            .catch(next)
    }

    addProduct(req, res, next) {
        const newProduct = {
            _id: new mongoose.Types.ObjectId(),
            _name: req.body._name,
            _brandId: req.body._brandId,
            _categoryId: req.body._categoryId,
            _detail: req.body._detail,
            _images: req.body._images,
            _price: req.body._price,
            _quantity: req.body._quantity,
            _salePercent: req.body._salePercent,
            _sold: 0,
            _status: true,
            _clickCount: 0
        }
        try {
            Products.create(newProduct)
            res.status(201).json({
                message: "Thêm sản phẩm thành công!"
            })
        }
        catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }
}

module.exports = new ProductsController