const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo không được bỏ trống']
    },
    comment: String,
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Khóa học không được bỏ trống']
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);