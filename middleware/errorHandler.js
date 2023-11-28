const CustomError = require('../errors/CustomError');

const notFound = async (req, res, next) => res.status(404).json({ msg: 'Không tìm thấy đường dẫn' });

const errorHandler = async (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ msg: err.message });
    }
    else if (err.name === 'ValidationError') {
        res.status(400).json({ msg: Object.values(err.errors).map(el => el.message).join('.') });
    }
    else if (err && err.code === 11000) {
        res.status(400).json({ msg: `${Object.keys(err.keyValue)} đã tồn tại` });
    }
    else if (err.name === 'CastError') {
        res.status(404).json({ msg: `Không tìm thấy id: ${err.value}` })
    }
    else {
        res.status(500).json({ msg: 'Somthing went wrong.Please try again !' })
    }
};

module.exports = { notFound, errorHandler };