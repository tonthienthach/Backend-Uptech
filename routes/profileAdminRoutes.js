const express = require('express');
const router = express.Router();
const profileAdminController = require('../controllers/profileAdminController');

router.get('/', profileAdminController.getUser);
router.put('/update-profile/', profileAdminController.updateProfile);
router.put(`/update-password/`, profileAdminController.changePassword);

module.exports = router