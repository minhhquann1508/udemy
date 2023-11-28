const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên khóa học không bỏ trống']
    },
    slug: String,
    subtitle: {
        type: String,
        required: [true, 'Phụ đề khóa học không bỏ trống']
    },
    desc: {
        type: String,
        required: [true, 'Mô tả khóa học không bỏ trống']
    },
    price: {
        type: Number,
        required: [true, 'Giá khóa học không bỏ trống']
    },
    thumbnail: String,
    trailer: String,
    target: [String],
    numberOfViews: {
        type: Number,
        default: 0
    },
    averangeRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Danh mục khóa học không bỏ trống']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo khóa học không bỏ trống']
    },
    numberOfVideo: Number,
    assignments: {
        type: Boolean,
        default: true
    },
    articles: Number,
    numberOfResouse: Number,
    allowSystem: {
        type: Boolean,
        default: true
    },
    certificate: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

CourseSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

CourseSchema.pre('save', async function () {
    this.slug = slugify(this.title, {
        lower: true,
        replacement: '-'
    });
});

module.exports = mongoose.model('Course', CourseSchema);