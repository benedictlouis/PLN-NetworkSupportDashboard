const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/user_controller.js');
const authMiddleware = require('../middleware/auth_middleware.js');

router.post('/login', userLogin.login);
router.post('/logout', userLogin.logout);

router.get('/all-accounts', authMiddleware.requireRole(['Admin', 'Super Admin']), userLogin.getAllAccounts);
router.post('/create-account', authMiddleware.requireRole(['Admin', 'Super Admin']), userLogin.createUserAccount);
router.put('/update-account', authMiddleware.requireRole(['Admin', 'Super Admin']), userLogin.updateUserAccount);
router.delete('/delete-account', authMiddleware.requireRole(['Admin', 'Super Admin']), userLogin.deleteUserAccount);


router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ 
        userId: req.session.userId,
        username: req.session.username,
        userRole: req.session.role
    });
});


module.exports = router;
