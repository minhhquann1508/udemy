const router = require('express').Router();
const { addToCart, getMyCart, updateCart, clearCart } = require('../controllers/cartController');
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');

router
    .route('/')
    .post(verifyToken, addToCart)
    .get(verifyToken, getMyCart)
    .put(verifyToken, updateCart);

router
    .route('/:id')
    .delete(verifyToken, clearCart);

module.exports = router;