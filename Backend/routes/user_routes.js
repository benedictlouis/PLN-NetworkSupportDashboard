const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/user_controller.js');

// Route untuk login
router.post('/login', userLogin.login);

module.exports = router;
