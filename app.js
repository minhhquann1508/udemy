require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const dbConnect = require('./db/dbConnect');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitizer = require('express-mongo-sanitize');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const courseRouter = require('./routes/course');
const reviewRouter = require('./routes/review');
const cartRouter = require('./routes/cart');

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}));
app.use(mongoSanitizer());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/cart', cartRouter);

app.use(errorHandler);
app.use(notFound);

dbConnect();

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});