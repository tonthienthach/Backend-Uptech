const jwt = require('jsonwebtoken')

const createToken = (user, expiredTime = '120') => {
    return jwt.sign({
        _id: user._id,
        _role: user._role,
        _fname: user._fname,
        _lname: user._lname
    },
        process.env.SECRET_KEY, { expiresIn: expiredTime })
}
module.exports = createToken
