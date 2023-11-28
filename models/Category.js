const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên danh mục không bỏ trống'],
        unique: true
    },
    slug: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo danh mục không bỏ trống'],
    }
}, { timestamps: true });

CategorySchema.pre('save', async function () {
    this.slug = slugify(this.title, {
        lower: true,
        replacement: '-'
    });
});

module.exports = mongoose.model('Category', CategorySchema);