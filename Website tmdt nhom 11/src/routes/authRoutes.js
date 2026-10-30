const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/auth/login - Đăng nhập nhận JWT Token
router.post('/login', authController.login);

// GET /api/auth/me - Lấy thông tin user hiện tại qua Token
router.get('/me', verifyToken, authController.getMe);

module.exports = router;

