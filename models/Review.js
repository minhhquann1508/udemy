const mongoose = require('mongoose');
const Course = require('./Course');

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

ReviewSchema.statics.calcAverangeRating = async function (courseId) {
    let result = await this.aggregate([
        {
            $match: { course: courseId }
        },
        {
            $group: {
                _id: null,
                numberOfReviews: {
                    $sum: 1
                },
                averangeRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);
    try {
        await Course.findByIdAndUpdate(
            courseId,
            {
                numberOfReviews: result[0]?.numberOfReviews || 0,
                averangeRating: Math.round(result[0]?.averangeRating * 100) / 100 || 0,
            }
        )
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    await this.constructor.calcAverangeRating(this.course);
});

ReviewSchema.post('deleteOne', { document: true }, async function () {
    console.log(this);
    await this.constructor.calcAverangeRating(this.course);
});

module.exports = mongoose.model('Review', ReviewSchema);