const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '2d' });
const generateRefreshToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

module.exports = { generateAccessToken, generateRefreshToken };