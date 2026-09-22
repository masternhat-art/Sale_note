const express = require('express');
const connectDB = require('./src/config/db');
const router = require('./src/routes/index');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 2. Đăng ký routes
router(app);

// 3. Khởi động Database và Server
async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running successfully on http://localhost:${PORT}`);
    });
}
startServer();
