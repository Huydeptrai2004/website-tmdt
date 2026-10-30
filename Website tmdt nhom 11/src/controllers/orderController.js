const db = require('../config/db');

/**
 * Lấy danh sách toàn bộ đơn hàng (ADMIN)
 * GET /api/orders
 */
const getAllOrders = (req, res) => {
  try {
    const { status, search } = req.query;
    let list = [...db.orders];

    if (status && status !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }

    // Sắp xếp đơn mới nhất lên đầu
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      total: list.length,
      orders: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách đơn hàng.',
      error: error.message
    });
  }
};

/**
 * Lấy chi tiết đơn hàng
 * GET /api/orders/:id
 */
const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = db.orders.find(o => String(o.id) === String(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng này.'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đơn hàng.',
      error: error.message
    });
  }
};

/**
 * Tạo đơn hàng mới
 * POST /api/orders
 */
const createOrder = (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      note
    } = req.body;

    if (!customerName || !shippingAddress || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tên khách hàng, địa chỉ giao hàng và danh sách sản phẩm.'
      });
    }

    const calculatedTotal = totalAmount || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const newOrder = {
      id: 'ORD-2026-' + String(db.orders.length + 1).padStart(3, '0'),
      customerName: customerName.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : 'guest@lumiere.com',
      customerPhone: customerPhone ? customerPhone.trim() : '',
      shippingAddress: shippingAddress.trim(),
      items: items.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image || ''
      })),
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      status: 'pending',
      note: note || '',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Đặt đơn hàng thành công!',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng.',
      error: error.message
    });
  }
};

/**
 * Cập nhật trạng thái đơn hàng (ADMIN)
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = db.orders.find(o => String(o.id) === String(id));
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng để cập nhật trạng thái.'
      });
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(', ')}`
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đơn hàng.',
      error: error.message
    });
  }
};

/**
 * Lấy dữ liệu thống kê tổng quan Dashboard (ADMIN)
 * GET /api/orders/stats
 */
const getOrderStats = (req, res) => {
  try {
    const totalOrders = db.orders.length;
    const completedOrders = db.orders.filter(o => o.status === 'completed');
    const pendingOrders = db.orders.filter(o => o.status === 'pending');
    const processingOrders = db.orders.filter(o => o.status === 'processing');
    const cancelledOrders = db.orders.filter(o => o.status === 'cancelled');

    // Tổng doanh thu từ các đơn hoàn thành
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    // Tổng khách hàng độc nhất
    const customerEmails = new Set(db.orders.map(o => o.customerEmail).filter(Boolean));
    const totalCustomers = customerEmails.size;

    // Tổng sản phẩm
    const totalProducts = db.products.length;

    // 5 đơn hàng gần nhất
    const recentOrders = [...db.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        completedCount: completedOrders.length,
        pendingCount: pendingOrders.length,
        processingCount: processingOrders.length,
        cancelledCount: cancelledOrders.length,
        totalCustomers,
        totalProducts,
        recentOrders
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tổng hợp dữ liệu thống kê.',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats
};

