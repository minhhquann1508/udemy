const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người dùng không được bỏ trống']
    },
    total: Number,
    courses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }]
});

module.exports = mongoose.model('Order', OrderSchema);