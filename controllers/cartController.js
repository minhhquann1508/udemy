const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const addToCart = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { course } = req.body;
    if (!course) throw new CustomError(400, 'Vui lòng cung cấp khóa học cần thêm')
    const myCart = await Cart
        .findOne({ user: userId })
        .populate({
            path: 'courses',
            populate: 'course'
        })
        .select('-__v');
    if (!myCart) {
        const cart = await Cart
            .create({ courses: [{ course }], user: userId });
        res.status(200).json({ msg: 'Thêm vào giỏ hàng thành công' });
    } else {
        const isAlreadyInCart = myCart.courses
            .find(el => el.course._id.toString() === course);
        if (!isAlreadyInCart) {
            myCart.courses = [...myCart.courses, { course }];
            await myCart.save();
            res.status(200).json({ msg: 'Thêm vào giỏ hàng thành công' });
        } else {
            throw new CustomError(400, 'Bạn đã thêm khóa học vào giỏ hàng rồi');
        }
    }
});

const getMyCart = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const myCart = await Cart
        .findOne({ user: userId })
        .populate({
            path: 'courses',
            populate: 'course'
        })
        .select('-__v');
    res.status(200).json({ myCart })
});

const updateCart = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const { userId } = req.user;
    if (!courseId) throw new CustomError(400, 'Không tìm thấy id khóa học')
    const cartUpdate = await Cart.findOneAndUpdate(
        { user: userId },
        { courses: { $pull: { course: courseId } } },
        { new: true }
    );
    if (!cartUpdate) throw new CustomError(400, 'Cập nhật giỏ hàng không thành công');
    res.status(200).json({ msg: 'Cập nhật giỏ hàng thành công' });
});

const clearCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) throw new CustomError(400, 'Xóa giỏ hàng không thành công')
    res.status(200).json({ msg: 'Xóa giỏ hàng thành công' });
});

module.exports = {
    addToCart,
    getMyCart,
    updateCart,
    clearCart
}