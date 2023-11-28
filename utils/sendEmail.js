const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: '"Udemy Website" <udemy@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Lấy lại mật khẩu", // Subject line
        html
    });

    return info;
});

module.exports = sendEmail;