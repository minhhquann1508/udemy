const router = require('express').Router();
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');
const {
    getAllUser,
    getSingleUser,
    getCurrentUser,
    updateUser,
    updateUserAvatar,
    blockUser,
    deleteUser,
    resquestToBeTeacher,
    checkRequestTeacher
} = require('../controllers/userController');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .get(verifyToken, checkRolePermission('admin'), getAllUser);

router
    .route('/current-user')
    .get(verifyToken, getCurrentUser);

router
    .route('/request-teacher')
    .get(verifyToken, checkRolePermission('user'), resquestToBeTeacher);

router
    .route('/check-request-teacher/:id')
    .put(verifyToken, checkRolePermission('admin'), checkRequestTeacher);

router
    .route('/upload-avatar')
    .put(verifyToken, uploader.single('avatar'), updateUserAvatar);

router
    .route('/block-user/:id')
    .put(verifyToken, checkRolePermission('admin'), blockUser);

router
    .route('/:id')
    .put(verifyToken, updateUser)
    .get(verifyToken, checkRolePermission('admin'), getSingleUser)
    .delete(verifyToken, checkRolePermission('admin'), deleteUser);


module.exports = router;