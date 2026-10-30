const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// Công khai: Xem danh sách & Chi tiết sản phẩm
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Quản trị viên (ADMIN): Thêm, Sửa, Xóa sản phẩm
router.post('/', verifyToken, requireAdmin, productController.createProduct);
router.put('/:id', verifyToken, requireAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, requireAdmin, productController.deleteProduct);

module.exports = router;

