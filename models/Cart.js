const mongoose = require('mongoose');

const cartItem = mongoose.Schema({
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Khóa học không bỏ trống']
    }
})

const CartSchema = new mongoose.Schema({
    courses: {
        type: [cartItem],
        required: [true, 'Vui lòng chọn sản phẩm cần thêm vào']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người dùng không được bỏ trống']
    }
});

module.exports = mongoose.model('Cart', CartSchema);