const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 1. Cấu hình Middlewares chung
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Phục vụ các file tĩnh (Static files)
// - Thư mục public/ cho trang web bán hàng (gốc '/')
app.use(express.static(path.join(__dirname, '..', 'public')));

// - Thư mục admin/ cho trang Quản trị ('/admin')
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// 3. Kết nối các Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 4. API Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'LUMIÈRE Fashion API Server is running smoothly.'
  });
});

// 5. Điều hướng mặc định cho /admin nếu truy cập không có đuôi .html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// 6. Xử lý lỗi 404 cho các API không tồn tại
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn API '${req.originalUrl}' không tồn tại trên hệ thống.`
  });
});

// 7. Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi nội bộ trên máy chủ.',
    error: err.message
  });
});

module.exports = app;

