const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/user_controller.js');
const checkAdmin = require('../middleware/auth_middleware.js');

// Route untuk login
router.post('/login', userLogin.login);
router.post('/register', userLogin.register);
router.post('/create-support', checkAdmin.checkAdmin, userLogin.createSupportAccount);
router.post('/delete-support', checkAdmin.checkAdmin, userLogin.deleteSupportAccount);



module.exports = router;
