const router = require('express').Router();
const {
    createReview,
    getAllReviewOfCourse,
    getSingleReview,
    updateReview,
    deleteReview,
    getAllReview
} = require('../controllers/reviewController');
const { verifyToken, checkRolePermission } = require('../middleware/verifyToken');

router
    .route('/')
    .get(getAllReview)
    .post(verifyToken, createReview);

router
    .route('/course-review/:courseId')
    .get(getAllReviewOfCourse);

router
    .route('/:id')
    .get(getSingleReview)
    .put(verifyToken, updateReview)
    .delete(verifyToken, deleteReview)

module.exports = router;