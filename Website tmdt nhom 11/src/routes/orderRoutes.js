const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// Thống kê đơn hàng cho Dashboard (ADMIN)
router.get('/stats', verifyToken, requireAdmin, orderController.getOrderStats);

// Quản lý danh sách đơn hàng (ADMIN)
router.get('/', verifyToken, requireAdmin, orderController.getAllOrders);
router.get('/:id', verifyToken, requireAdmin, orderController.getOrderById);

// Cập nhật trạng thái đơn hàng (ADMIN)
router.put('/:id/status', verifyToken, requireAdmin, orderController.updateOrderStatus);

// Tạo đơn hàng mới (Dành cho khách mua hàng hoặc test tạo đơn)
router.post('/', orderController.createOrder);

module.exports = router;

