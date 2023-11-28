const router = require('express').Router();
const {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');

router
    .route('/')
    .get(getAllCategories)
    .post(verifyToken, checkRolePermission('admin'), createCategory);

router
    .route('/:id')
    .get(getSingleCategory)
    .put(verifyToken, checkRolePermission('admin'), updateCategory)
    .delete(verifyToken, checkRolePermission('admin'), deleteCategory);

module.exports = router;