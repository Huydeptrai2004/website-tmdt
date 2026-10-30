const bcrypt = require('bcryptjs');

// Hash mật khẩu mẫu 'admin123' và 'user123'
const adminPasswordHash = bcrypt.hashSync('admin123', 10);
const userPasswordHash = bcrypt.hashSync('user123', 10);

/**
 * CSDL Mẫu trong bộ nhớ (In-memory Mock Database)
 * Dành cho hệ thống LUMIÈRE Fashion Store & Admin
 */
const db = {
  // 1. Danh sách tài khoản người dùng & quản trị viên
  users: [
    {
      id: 'usr_admin01',
      name: 'Quản trị viên LUMIÈRE',
      email: 'admin@lumiere.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      phone: '0901 234 567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'usr_staff01',
      name: 'Nguyễn Văn Quản Lý',
      email: 'manager@lumiere.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      phone: '0912 345 678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      createdAt: '2026-01-15T09:30:00.000Z'
    },
    {
      id: 'usr_cust01',
      name: 'Trần Thị Mai',
      email: 'customer@gmail.com',
      password: userPasswordHash,
      role: 'USER',
      phone: '0987 654 321',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: '2026-02-01T14:15:00.000Z'
    }
  ],

  // 2. Dữ liệu mẫu Sản phẩm thời trang
  products: [
    {
      id: 's001',
      name: 'Draped Crepe Dress',
      category: 'Women',
      price: 6625000,
      originalPrice: 7200000,
      stock: 35,
      rating: 4.9,
      soldCount: 84,
      image: 'https://picsum.photos/seed/shop1/400/500',
      description: 'Đầm xếp nếp chất liệu crepe lụa cao cấp, phong cách thanh lịch hiện đại cho những buổi tiệc sang trọng.',
      isNew: true,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-02-10T10:00:00.000Z'
    },
    {
      id: 's002',
      name: 'Linen Wrap Blouse',
      category: 'Women',
      price: 3125000,
      originalPrice: 3125000,
      stock: 48,
      rating: 4.8,
      soldCount: 120,
      image: 'https://picsum.photos/seed/shop2/400/500',
      description: 'Áo sơ mi vạt chéo chất liệu linen tự nhiên thoáng mát, tôn dáng và dễ phối đồ công sở.',
      isNew: false,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-02-12T11:00:00.000Z'
    },
    {
      id: 's003',
      name: 'Tailored Wide-Leg Jeans',
      category: 'Women',
      price: 2450000,
      originalPrice: 3475000,
      stock: 22,
      rating: 4.7,
      soldCount: 95,
      image: 'https://picsum.photos/seed/shop3/400/500',
      description: 'Quần jeans ống rộng may đo chỉn chu, chất denim dệt thô cao cấp giữ form tuyệt đối.',
      isNew: false,
      isFeatured: false,
      status: 'active',
      createdAt: '2026-02-15T09:20:00.000Z'
    },
    {
      id: 's004',
      name: 'Merino Rib Turtleneck',
      category: 'Women',
      price: 4200000,
      originalPrice: 4200000,
      stock: 19,
      rating: 4.9,
      soldCount: 60,
      image: 'https://picsum.photos/seed/shop4/400/500',
      description: 'Áo len dệt kim cổ lọ len cừu Merino mềm mại, giữ ấm tuyệt vời trong mùa lạnh.',
      isNew: true,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-02-18T14:00:00.000Z'
    },
    {
      id: 's005',
      name: 'Oversized Cashmere Coat',
      category: 'Women',
      price: 12500000,
      originalPrice: 15000000,
      stock: 12,
      rating: 5.0,
      soldCount: 32,
      image: 'https://picsum.photos/seed/shop5/400/500',
      description: 'Áo khoác dáng dài chất dạ Cashmere thượng hạng, biểu tượng của sự sang trọng vượt thời gian.',
      isNew: false,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-02-20T16:45:00.000Z'
    },
    {
      id: 's006',
      name: 'Silk Slip Midi Skirt',
      category: 'Women',
      price: 3800000,
      originalPrice: 3800000,
      stock: 40,
      rating: 4.6,
      soldCount: 78,
      image: 'https://picsum.photos/seed/shop6/400/500',
      description: 'Chân váy lụa satin bóng nhẹ, đường cắt chéo tôn vòng eo quyến rũ.',
      isNew: false,
      isFeatured: false,
      status: 'active',
      createdAt: '2026-02-22T08:15:00.000Z'
    },
    {
      id: 's007',
      name: 'Italian Wool Blazer',
      category: 'Men',
      price: 8900000,
      originalPrice: 9500000,
      stock: 18,
      rating: 4.9,
      soldCount: 45,
      image: 'https://picsum.photos/seed/shop7/400/500',
      description: 'Blazer nam chất len Ý cao cấp, form may chuẩn phong cách quý ông Milan.',
      isNew: true,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-02-25T10:30:00.000Z'
    },
    {
      id: 's008',
      name: 'Minimalist Leather Tote',
      category: 'Accessories',
      price: 5200000,
      originalPrice: 5200000,
      stock: 25,
      rating: 4.8,
      soldCount: 110,
      image: 'https://picsum.photos/seed/shop8/400/500',
      description: 'Túi tote da bò nguyên tấm xử lý thủ công, ngăn chứa rộng rãi và độ bền vượt trội.',
      isNew: false,
      isFeatured: true,
      status: 'active',
      createdAt: '2026-03-01T15:20:00.000Z'
    }
  ],

  // 3. Dữ liệu mẫu Đơn hàng (Orders)
  orders: [
    {
      id: 'ORD-2026-001',
      customerName: 'Hoàng Minh Tuấn',
      customerEmail: 'minhtuan.h@gmail.com',
      customerPhone: '0918 889 900',
      shippingAddress: '45 Lê Duẩn, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      items: [
        {
          productId: 's001',
          name: 'Draped Crepe Dress',
          price: 6625000,
          quantity: 1,
          image: 'https://picsum.photos/seed/shop1/400/500'
        },
        {
          productId: 's008',
          name: 'Minimalist Leather Tote',
          price: 5200000,
          quantity: 1,
          image: 'https://picsum.photos/seed/shop8/400/500'
        }
      ],
      totalAmount: 11825000,
      paymentMethod: 'Chuyển khoản ngân hàng',
      paymentStatus: 'paid',
      status: 'completed',
      note: 'Giao trong giờ hành chính',
      createdAt: '2026-03-12T10:15:00.000Z'
    },
    {
      id: 'ORD-2026-002',
      customerName: 'Nguyễn Thị Bích Ngọc',
      customerEmail: 'bichngoc.ng@yahoo.com',
      customerPhone: '0903 556 778',
      shippingAddress: '128 Kim Mã, Ba Đình, Hà Nội',
      items: [
        {
          productId: 's005',
          name: 'Oversized Cashmere Coat',
          price: 12500000,
          quantity: 1,
          image: 'https://picsum.photos/seed/shop5/400/500'
        }
      ],
      totalAmount: 12500000,
      paymentMethod: 'COD (Thanh toán khi nhận hàng)',
      paymentStatus: 'pending',
      status: 'processing',
      note: 'Kiểm tra hàng trước khi nhận',
      createdAt: '2026-03-14T14:30:00.000Z'
    },
    {
      id: 'ORD-2026-003',
      customerName: 'Phạm Đức Anh',
      customerEmail: 'ducanh.pham@outlook.com',
      customerPhone: '0934 112 233',
      shippingAddress: '88 Nguyễn Thị Minh Khai, Hải Châu, Đà Nẵng',
      items: [
        {
          productId: 's007',
          name: 'Italian Wool Blazer',
          price: 8900000,
          quantity: 1,
          image: 'https://picsum.photos/seed/shop7/400/500'
        },
        {
          productId: 's003',
          name: 'Tailored Wide-Leg Jeans',
          price: 2450000,
          quantity: 2,
          image: 'https://picsum.photos/seed/shop3/400/500'
        }
      ],
      totalAmount: 13800000,
      paymentMethod: 'Thẻ tín dụng / Ghi nợ',
      paymentStatus: 'paid',
      status: 'completed',
      note: '',
      createdAt: '2026-03-15T09:45:00.000Z'
    },
    {
      id: 'ORD-2026-004',
      customerName: 'Lê Thuỳ Dung',
      customerEmail: 'thuydung.le@gmail.com',
      customerPhone: '0977 445 667',
      shippingAddress: '15 Thảo Điền, Thành phố Thủ Đức, TP. Hồ Chí Minh',
      items: [
        {
          productId: 's002',
          name: 'Linen Wrap Blouse',
          price: 3125000,
          quantity: 2,
          image: 'https://picsum.photos/seed/shop2/400/500'
        }
      ],
      totalAmount: 6250000,
      paymentMethod: 'Ví MoMo',
      paymentStatus: 'pending',
      status: 'pending',
      note: 'Giao vào cuối tuần',
      createdAt: '2026-03-16T16:20:00.000Z'
    },
    {
      id: 'ORD-2026-005',
      customerName: 'Vũ Quốc Bảo',
      customerEmail: 'baovq@fpt.com.vn',
      customerPhone: '0908 990 011',
      shippingAddress: '68 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
      items: [
        {
          productId: 's004',
          name: 'Merino Rib Turtleneck',
          price: 4200000,
          quantity: 1,
          image: 'https://picsum.photos/seed/shop4/400/500'
        }
      ],
      totalAmount: 4200000,
      paymentMethod: 'COD',
      paymentStatus: 'cancelled',
      status: 'cancelled',
      note: 'Khách đổi ý',
      createdAt: '2026-03-16T18:00:00.000Z'
    }
  ]
};

module.exports = db;

