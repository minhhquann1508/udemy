const Category = require('../models/Category');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createCategory = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const category = await Category.create({ ...req.body, createdBy: userId });
    res.status(201).json({ category });
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).select('-__v').populate('createdBy', 'fullname');
    res.status(200).json({ categories });
});

const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id).select('-__v').populate('createdBy', 'fullname');
    res.status(200).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const category = await Category.findById(id).select('-__v').populate('createdBy', 'fullname');
    category.title = title;
    await category.save();
    res.status(200).json({ msg: 'Cập nhật thành công', category });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new CustomError(400, 'Xóa không thành công')
    await Course.deleteMany({ category: id });
    res.status(200).json({ msg: 'Xóa thành công' });
});

module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
};



