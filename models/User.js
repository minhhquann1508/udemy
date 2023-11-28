const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Tên người dùng không được bỏ trống']
    },
    email: {
        type: String,
        required: [true, 'Email người dùng không được bỏ trống'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu người dùng không được bỏ trống'],
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại người dùng không được bỏ trống'],
        unique: true
    },
    gender: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    avatar: String,
    desc: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'teacher']
    },
    requestTeacher: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.isPasswordCorrect = async function (enterdPassword) {
    const isMatch = await bcrypt.compare(enterdPassword, this.password);
    return isMatch;
};

UserSchema.methods.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
};

module.exports = mongoose.model('User', UserSchema);