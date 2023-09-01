const mongoose = require('mongoose');
const Brands = require('../models/Brands')

class brandsControllers {
    // api/brands (get all categorys)
    getAllBrands(req, res, next) {
        Brands.find({})
            .then((brands) => {
                res.json(brands);
            })
            .catch(next);
    }
}

module.exports = new brandsControllers