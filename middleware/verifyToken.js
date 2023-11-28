const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    if (!req?.headers?.authorization?.startsWith('Bearer ')) {
        res.status(401).json({ msg: 'Không tìm thấy token' })
    }
    const token = req?.headers?.authorization?.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            res.status(401).json({ msg: 'Token không hợp lệ' })
        }
        req.user = decode;
        next();
    });
};

const checkRolePermission = (...role) => {
    return async (req, res, next) => {
        if (role.includes(req.user.role)) {
            next();
        } else {
            res.status(401).json({ msg: 'Bạn không đủ quyền truy cập' });
        }
    }
};

module.exports = { verifyToken, checkRolePermission };