const Banners = require('../models/Banners');
class BannersController {

    async getBannerImgs(req, res, next) {
        await Banners.find({})
            .then((banners) => {
                res.json(banners);
            })
            .catch(next);

    }

}


module.exports = new BannersController