const Products = require('../models/Products');
const mongoose = require('mongoose');

class ProductsController {

    // api/:slug
    // VD: http://localhost:5000/api/products/64b6367474e10f82ea5c17d7
    getProduct(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Products.findOne({ _id: slugObjectId }).populate('_categoryId')
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

    updateData(req, res, next) {
        Products.find(
            {
                _price: {
                    $exists: true,
                    $type: 2
                }
            }
        )
            // Update each document's price field
            .then((products) => {
                products.forEach((product) => {
                    let newPrice = parseInt(product.price, 10)
                    Products.updateOne(
                        { _id: product._id },
                        {
                            $set: {
                                _price: newPrice
                            }
                        }
                    )
                    console.log(typeof product._price)
                }
                )
                res.json(products)
            })
            .catch(next)
    }

    // api/top5BestSellingProducts
    get5BestSellingProducts(req, res, next) {
        Products.find({ _price })
    }

}

module.exports = new ProductsController