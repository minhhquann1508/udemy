const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createOrder = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { courses } = req.body;
    if (!courses || courses.length < 1) throw new CustomError(400, 'Cung cấp các sản phẩm cần thanh toán')
    // const total = courses.reduce((sum,el) => sum + el,0)
    const order = await Order.create({ courses, user: userId });
    res.status(200).json({})
});

