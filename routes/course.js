const router = require('express').Router();
const {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    updateCourseThumbnail,
    deleteCourse
} = require('../controllers/courseController');
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .post([verifyToken, checkRolePermission('teacher', 'admin')], createCourse)
    .get(getAllCourses);

router
    .route('/update-thubnail/:id')
    .put([verifyToken, checkRolePermission('teacher', 'admin')], uploader.single('thumbnail'), updateCourseThumbnail);

router
    .route('/:id')
    .put([verifyToken, checkRolePermission('teacher', 'admin')], updateCourse)
    .get(getSingleCourse)
    .delete([verifyToken, checkRolePermission('teacher', 'admin')], deleteCourse);

module.exports = router;