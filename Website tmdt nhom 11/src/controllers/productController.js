const db = require('../config/db');

/**
 * Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc danh mục, sắp xếp)
 * GET /api/products
 */
const getAllProducts = (req, res) => {
  try {
    let { search, category, sort } = req.query;
    let list = [...db.products];

    // Lọc theo từ khóa tìm kiếm (tên hoặc mô tả)
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Lọc theo danh mục
    if (category && category.toLowerCase() !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Sắp xếp
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      success: true,
      total: list.length,
      products: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách sản phẩm.',
      error: error.message
    });
  }
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 * GET /api/products/:id
 */
const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = db.products.find(p => String(p.id) === String(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm với mã ID này.'
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết sản phẩm.',
      error: error.message
    });
  }
};

/**
 * Thêm sản phẩm mới (ADMIN)
 * POST /api/products
 */
const createProduct = (req, res) => {
  try {
    const { name, category, price, originalPrice, stock, image, description, isNew, isFeatured, status } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm và giá bán là bắt buộc.'
      });
    }

    // Tạo ID mới ngẫu nhiên hoặc theo thứ tự
    const newId = 's' + Math.floor(100 + Math.random() * 900);

    const newProduct = {
      id: newId,
      name: name.trim(),
      category: category || 'Women',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      stock: stock !== undefined ? Number(stock) : 10,
      rating: 5.0,
      soldCount: 0,
      image: image && image.trim() !== '' ? image.trim() : `https://picsum.photos/seed/${newId}/400/500`,
      description: description ? description.trim() : 'Sản phẩm thời trang cao cấp từ bộ sưu tập LUMIÈRE.',
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      status: status || 'active',
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo mới sản phẩm.',
      error: error.message
    });
  }
};

/**
 * Cập nhật thông tin sản phẩm (ADMIN)
 * PUT /api/products/:id
 */
const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm cần cập nhật.'
      });
    }

    const { name, category, price, originalPrice, stock, image, description, isNew, isFeatured, status } = req.body;

    const existing = db.products[index];
    const updatedProduct = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      category: category !== undefined ? category : existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
      stock: stock !== undefined ? Number(stock) : existing.stock,
      image: image !== undefined && image.trim() !== '' ? image.trim() : existing.image,
      description: description !== undefined ? description.trim() : existing.description,
      isNew: isNew !== undefined ? Boolean(isNew) : existing.isNew,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
      status: status !== undefined ? status : existing.status,
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updatedProduct;

    return res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      product: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sản phẩm.',
      error: error.message
    });
  }
};

/**
 * Xóa sản phẩm (ADMIN)
 * DELETE /api/products/:id
 */
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm để xóa.'
      });
    }

    const deleted = db.products.splice(index, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm thành công!',
      deletedId: deleted.id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm.',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

