const router = require('express').Router();
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');

router.post('/register', register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);

module.exports = router;