const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        if (connection.connection.readyState === 1) {
            console.log('DB connected successfully');
        } else {
            console.log('DB connected failed');
        }
    } catch (error) {
        console.log('DB connected failed');
    }
};

module.exports = dbConnect;