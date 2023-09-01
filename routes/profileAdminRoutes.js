const express = require('express');
const router = express.Router();
const profileAdminController = require('../controllers/profileAdminController');

router.get('/:slug', profileAdminController.getUser);

module.exports = router