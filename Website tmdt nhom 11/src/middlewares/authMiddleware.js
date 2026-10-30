const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lumiere_secret_jwt_key_2026';

/**
 * Middleware xác thực token JWT
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập.'
    });
  }

  // Lấy token từ chuỗi "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc bị trống.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
      error: error.message
    });
  }
};

/**
 * Middleware kiểm tra quyền ADMIN
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Yêu cầu xác thực tài khoản.'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Truy cập bị từ chối: Yêu cầu quyền Quản trị viên (ADMIN).'
    });
  }

  next();
};

module.exports = {
  JWT_SECRET,
  verifyToken,
  requireAdmin
};

