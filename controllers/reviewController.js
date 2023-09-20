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



    //http://localhost:5000/api/reviews/post-new-comment
    //method: POST
    //

    // VD: http://localhost:5000/api/reviews/64b6367474e10f82ea5c17d7
    getAProductReviews(req, res, next) {
        let slugObjectId = new mongoose.Types.ObjectId(req.params.slug)
        Reviews.find({ _pId: slugObjectId }).populate('_uId', '_fname _lname _avatar')
            .then((reviews) => {
                res.json(reviews);
            })
            .catch(next)
    }



    //http://localhost:5000/api/reviews/post-new-comment
    //method: POST
    //token bearer
    // Body: {

    //   "_content": "Sản phẩm tệ quá",
    //   "_rating": 1,
    //   "_pId": "64b8df183f112befd61907dd",
    //   "_images": [
    //     "https://hcmuteeduvn-my.sharepoint.com/:i:/g/personal/20110234_st_hcmute_edu_vn/EcA_X3aVRWxGrxSZ7rYl30sBOlMi0poAm170GP2MH3hj0w?e=ceUxub",
    //     "https://hcmuteeduvn-my.sharepoint.com/:i:/g/personal/20110234_st_hcmute_edu_vn/EcA_X3aVRWxGrxSZ7rYl30sBOlMi0poAm170GP2MH3hj0w?e=ceUxub",
    //     "https://hcmuteeduvn-my.sharepoint.com/:i:/g/personal/20110234_st_hcmute_edu_vn/EcA_X3aVRWxGrxSZ7rYl30sBOlMi0poAm170GP2MH3hj0w?e=ceUxub",
    //     "https://hcmuteeduvn-my.sharepoint.com/:i:/g/personal/20110234_st_hcmute_edu_vn/EcA_X3aVRWxGrxSZ7rYl30sBOlMi0poAm170GP2MH3hj0w?e=ceUxub",
    //     "https://hcmuteeduvn-my.sharepoint.com/:i:/g/personal/20110234_st_hcmute_edu_vn/EcA_X3aVRWxGrxSZ7rYl30sBOlMi0poAm170GP2MH3hj0w?e=ceUxub"
    //   ]
    // }
    postNewComment = async (req, res, next) => {
        const { _id, _role } = req.user
        const { _content, _rating, _pId, _images } = req.body
        try {
            const newReview = {
                _content: _content,
                _rating: _rating,
                _uId: _id,
                _pId: _pId,
                _images: _images
            }
            await Reviews.create(newReview)
            res.status(201).json({
                message: 'Tạo bình luận thành công!',
                data: {
                    newReview: newReview
                }
            })
        }
        catch (err) {

        }
    }
}

module.exports = new ReviewsControler