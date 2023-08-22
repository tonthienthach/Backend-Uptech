const Banners = require('../models/Banners');
const Product = require('../models/Products'); // Đường dẫn đến model Products
class OtherController {

    async getBannerImgs(req, res, next) {
        await Banners.find({})
            .then((banners) => {
                res.json(banners);
            })
            .catch(next);

    }

}


module.exports = new OtherController