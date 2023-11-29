const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createReview = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const review = await Review.create({ ...req.body, postedBy: userId });
    res.status(201).json({ msg: 'Đăng bình luận thành công', review });
});

const getAllReview = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;
    const review = await Review
        .find({})
        .skip(skip)
        .limit(limit)
        .populate('postedBy', 'fullname avatar role')
        .populate('course', 'title thumbnail')
        .select('-__v');
    res.status(200).json({ review });
});

const getAllReviewOfCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const reviews = await Review
        .find({ course: courseId })
        .populate('postedBy', 'fullname avatar role')
        .populate('course', 'title thumbnail')
        .select('-__v');
    res.status(200).json({ reviews })
});

const getSingleReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review
        .findById(id)
        .populate('postedBy', 'fullname avatar role')
        .populate('course', 'title thumbnail')
        .select('-__v');
    if (!review) throw new CustomError(404, `Không tìm thấy bình luận với id:${id}`);
    res.status(200).json({ review });
});

const updateReview = asyncHandler(async (req, res) => {
    const { comment, rating } = req.body;
    const { id } = req.params;
    const { userId } = req.user;
    if (!comment || !rating) throw new CustomError(400, 'Vui lòng nhập bình luận và rating')
    const review = await Review.findById(id);
    if (!review) throw new CustomError(404, `Không tìm thấy bình luận với id:${id}`)
    if (review.postedBy.toString() !== userId) throw new CustomError(401, 'Bạn không đủ quyền thực hiện')
    review.comment = comment;
    review.rating = rating;
    await review.save();
    res.status(200).json({ msg: 'Cập nhật thành công' });
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new CustomError(400, 'Xóa đánh giá không thành công')
    await review.deleteOne();
    res.status(200).json({ msg: 'Xoá bình luận thành công' });
});

module.exports = {
    createReview,
    getAllReview,
    getAllReviewOfCourse,
    getSingleReview,
    updateReview,
    deleteReview
};