const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createCourse = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const course = await Course.create({ ...req.body, owner: userId });
    res.status(201).json({ msg: 'Thêm khóa học thành công' });
});

const getAllCourses = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    let excludeFields = ['sort', 'limit', 'page', 'fields'];
    excludeFields.forEach(field => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    let formatQueries = JSON.parse(queryString);

    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Course.find(formatQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ') || 'createdAt';
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const courses = await queryCommand
        .skip(skip)
        .limit(limit)
        .populate('category', 'title')
        .populate('owner', 'fullname')
        .select('-__v');
    const total = await Course.countDocuments();
    res.status(200).json({
        courses,
        total,
        currentPage: page,
        itemPerPage: Number(limit)
    });
});

const getSingleCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course
        .findByIdAndUpdate(id, { $inc: { numberOfViews: 1 } }, { new: true, runValidators: true })
        .populate('owner', 'fullname')
        .populate('category', 'title')
        .select('-__v');
    if (!course) throw new CustomError(404, `Không tìm thấy khóa học với id: ${id}`);
    res.status(200).json({ course });
});

const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course
        .findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        ).
        populate('owner', 'fullname')
        .populate('category', 'title')
        .select('-__v');
    if (!course) throw new CustomError(400, 'Cập nhật không thành công');
    res.status(200).json({ msg: 'Cập nhật thành công', course });
});

const updateCourseThumbnail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const uploadFile = req.file;
    if (!uploadFile) throw new CustomError(404, 'Không tìm thấy tệp')
    if (!uploadFile.mimetype.startsWith('image')) throw new CustomError(404, 'Vui lòng cung cấp hình ảnh')
    const maxsize = 1024 * 1024;
    if (uploadFile.size > maxsize) throw new CustomError(400, 'Ảnh vượt quá dung lượng 1MB')
    const course = await Course.findById(id);
    course.thumbnail = uploadFile.path;
    await course.save();
    res.status(200).json({ msg: 'Cập nhật hình ảnh thành công', path: uploadFile.path });
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) throw new CustomError(400, 'Xóa khóa học không thành công')
    res.status(200).json({ msg: 'Xóa khóa học thành công' });
});

module.exports = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    updateCourseThumbnail,
    deleteCourse
};