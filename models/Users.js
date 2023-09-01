const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _fname: String,
    _lname: String,
    _phones: Array,
    _email: String,
    _pw: String,
    _role: String,
    _dateOfBirth: Date,
    _gender: String,
    _avatar: String,
    _address: Array

});

const Users = mongoose.model('users', userSchema);
module.exports = Users;