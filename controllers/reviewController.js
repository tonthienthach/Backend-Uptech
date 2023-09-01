const Reviews = require('../models/Reviews')
const mongoose = require('mongoose')
class ReviewsControler {

    // VD: http://localhost:5000/api/reviews/64b6367474e10f82ea5c17d7
    getAProductReviews(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Reviews.find({ _pId: slugObjectId }).populate('_uId', '_fname _lname _avatar')
            .then((reviews) => {
                res.json(reviews);
            })
            .catch(next)
    }
}

module.exports = new ReviewsControler