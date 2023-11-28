const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const sendEmail = require('../utils/sendEmail');

const register = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const isEmailAlreadyRegistered = await User.findOne({ email });
    if (isEmailAlreadyRegistered) throw new CustomError(400, 'Email này đã tồn tại');
    const isFirstAccount = await User.find({}).countDocuments() === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    await User.create({ ...req.body, role });
    res.status(201).json({ msg: 'Đăng ký thành công' })
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new CustomError(400, 'Vui lòng cung cấp email và mật khẩu');
    const user = await User.findOne({ email });
    if (!user) throw new CustomError(400, `Người dùng không tồn tại`);
    if (user && !(await user.isPasswordCorrect(password))) throw new CustomError(400, 'Mật khẩu không hợp lệ');
    const { role, _id } = user;
    const accessToken = generateAccessToken(_id, role);
    const refreshToken = generateRefreshToken(_id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 60 * 60 * 24 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: 30 * 60 * 60 * 24 * 1000
    });

    res.status(200).json({
        msg: 'Đăng nhập thành công',
        user: {
            email: user.email,
            phone: user.phone,
            fullname: user.fullname,
            gender: user.gender,
            avatar: user.avatar,
            refreshToken: user.refreshToken,
            accessToken
        }
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.signedCookies;
    if (!cookie || !cookie.refreshToken) throw new CustomError(400, 'Không tìm thấy refresh token trong cookies');

    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });

    res.status(200).json({ msg: 'Đăng xuất thành công' })
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new CustomError(400, 'Không tìm thấy người dùng');
    await user.createResetPasswordToken();
    await user.save();
    const url = `${process.env.APP_URL}/reset-password?email=${email}&token=${user.resetPasswordToken}`
    const html = `<h4>Click vào <a href=${url}>đây</a> để đặt lại mật khẩu.Email này có hiệu lực trong 10 phút.</h4>`;
    await sendEmail({ email, html });
    res.status(200).json({ msg: 'Gửi yêu cầu lấy lại mật khẩu thành công' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, token, password } = req.body;
    if (!email || !token) throw new CustomError(400, 'Vui lòng cung cấp đầy đủ email và token');
    const user = await User.findOne({ email, resetPasswordTokenExpires: { $gte: new Date(Date.now()) } });
    if (!user) throw new CustomError(400, 'Cập nhật mật khẩu không thành công');
    if (token !== user.resetPasswordToken) throw new CustomError(400, 'Cập nhật mật khẩu không thành công');
    else {
        user.resetPasswordTokenExpires = '';
        user.resetPasswordToken = '';
        user.password = password;
        await user.save();
        res.status(200).json({ msg: 'Cập nhật lại mật khẩu thành công' });
    }
});

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
}