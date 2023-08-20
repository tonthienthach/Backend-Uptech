const Users = require('../models/Users');

class UsersController {

    async getAllAccounts(req, res, next) {
        await Users.find({})
            .then((users) => {
                res.json(users);
            })
            .catch(next);

    }
}

module.exports = new UsersController