const mongoose = require('mongoose');
const Categories = require('../models/Categories')

class categoriesController {
    // api/categorys (get all categorys)
    getAllCategories(req, res, next) {
        Categories.find({ _status: true })
            .then((Categories) => {
                res.json(Categories);
            })
            .catch(next);
    }
}

module.exports = new categoriesController