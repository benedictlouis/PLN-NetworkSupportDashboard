const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/user_controller.js');
const authMiddleware = require('../middleware/auth_middleware.js');

// Route untuk login
router.post('/login', userLogin.login);
router.get('/all-accounts', userLogin.getAllAccounts);
router.post('/create-account', authMiddleware.checkAdmin, userLogin.createUserAccount);
router.put('/update-account', authMiddleware.checkAdmin, userLogin.updateUserAccount)
router.delete('/delete-account', authMiddleware.checkAdmin, userLogin.deleteUserAccount);



module.exports = router;
