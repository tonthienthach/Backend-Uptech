const Products = require('../models/Products');
const mongoose = require('mongoose');

class ProductsController {

    // api/:slug
    // VD: http://localhost:5000/api/products/64b6367474e10f82ea5c17d7
    getProduct(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Products.findOne({ _id: slugObjectId }).populate('_categoryId', '_name').populate('_brandId', '_name')
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
        Products.find().sort({ _sold: -1 }).limit(10)
            .then(products => {
                res.json(products)
            })
            .catch(next)
    }

    // api/products/onSale
    getOnSale(req, res, next) {
        Products.find({ _salePercent: { $gt: 0 }, _status: true })
            .then(products => {
                res.json(products)
            })
            .catch(next)
    }

    // api/products/mostSearched
    getMostSearched(req, res, next) {
        Products.find().sort({ _clickCount: -1 }).limit(10)
            .then(products => {
                res.json(products)
            })
            .catch(next)

    }

}

module.exports = new ProductsController