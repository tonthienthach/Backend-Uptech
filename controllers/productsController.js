const Products = require('../models/Products');
const mongoose = require('mongoose');

class ProductsController {

    // api/:slug
    // VD: http://localhost:5000/api/products/64b6367474e10f82ea5c17d7
    getProduct(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Products.findOne({ _id: slugObjectId })
            .then((product) => {
                res.json(product);
            })
            .catch(next)
    }


    // api/products (get all products)
    getAllProducts(req, res, next) {
        Products.find({})
            .then((products) => {
                res.json(products);
            })
            .catch(next);

    }
}

module.exports = new ProductsController