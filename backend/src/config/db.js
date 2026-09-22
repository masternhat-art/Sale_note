// File: src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
    try {
        // Thay đường dẫn này bằng URI MongoDB local của bạn
        // sales_route_db là tên database, nó sẽ tự động được tạo nếu chưa có
        await mongoose.connect('mongodb://127.0.0.1:27017/Moi_chun');
        console.log('Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error.message);
        process.exit(1); // Dừng hoàn toàn ứng dụng nếu không thể kết nối tới DB
    }
}

module.exports = connectDB;