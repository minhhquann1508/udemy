const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');
const ignoreKey = require('../utils/constant');

const getAllUser = asyncHandler(async (req, res) => {
    const { fullname, role, requestTeacher } = req.query;
    let queries = {};

    if (fullname) {
        queries.fullname = { $regex: fullname, $options: 'i' };
    }
    if (role) {
        queries.role = role;
    }
    if (requestTeacher) {
        queries.requestTeacher = requestTeacher;
    }
    let result = User.find(queries);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    result = result.skip(skip).limit(limit).select(ignoreKey);
    const users = await result;

    res.status(200).json({ users, currentPage: page, total });
});

const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select(ignoreKey);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${id}`);
    res.status(200).json({ user });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId).select(ignoreKey);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${id}`);
    res.status(200).json({ user });
});

const resquestToBeTeacher = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${userId}`);
    user.requestTeacher = true;
    await user.save();
    res.status(200).json({ msg: 'Gửi yêu cầu thành công' });
});

const checkRequestTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { result } = req.body;
    const user = await User.findById(id);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${id}`);
    user.role = result ? 'teacher' : 'user';
    user.requestTeacher = false;
    await user.save();
    res.status(200).json({ msg: 'Xác thực thành công' });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { fullname, phone, gender, youtube, website, facebook, twiter, linkdedin, desc } = req.body;
    const user = await User.findById(id).select(ignoreKey);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${id}`);
    if (user._id.toString() !== userId) throw new CustomError(401, 'Bạn không đủ quyền thực hiện')
    user.fullname = fullname;
    user.phone = phone;
    user.gender = gender;
    user.youtube = youtube;
    user.facebook = facebook;
    user.website = website;
    user.twiter = twiter;
    user.linkdedin = linkdedin;
    user.desc = desc;
    await user.save();
    res.status(200).json({ msg: 'Cập nhật thành công', user });
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const uploadFile = req.file;
    if (!uploadFile) throw new CustomError(404, 'Không tìm thấy tệp')
    if (!uploadFile.mimetype.startsWith('image')) throw new CustomError(404, 'Vui lòng cung cấp hình ảnh')
    const maxsize = 1024 * 1024;
    if (uploadFile.size > maxsize) throw new CustomError(400, 'Ảnh vượt quá dung lượng 1MB')
    const user = await User.findById(userId);
    user.avatar = uploadFile.path;
    await user.save();
    res.status(200).json({ msg: 'Cập nhật hình ảnh thành công', path: uploadFile.path });
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select(ignoreKey);
    if (!user) throw new CustomError(400, `Không tìm thấy người dùng với id: ${id}`);
    if (user.isBlocked) {
        user.isBlocked = false;
    } else {
        user.isBlocked = true;
    }
    await user.save();
    res.status(200).json({ msg: 'Cập nhật thành công' });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await User.findByIdAndDelete(id);
    res.status(response ? 200 : 500).json({
        msg: response ? 'Xóa người dùng thành công' : 'Xóa người dùng không thành công'
    });
});

module.exports = {
    getAllUser,
    getSingleUser,
    getCurrentUser,
    updateUser,
    updateUserAvatar,
    blockUser,
    resquestToBeTeacher,
    checkRequestTeacher,
    deleteUser
};



