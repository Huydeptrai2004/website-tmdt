const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════════════════╗');
  console.log('  ║       ✨ LUMIÈRE FASHION STORE & ADMIN API ✨         ║');
  console.log('  ╚═══════════════════════════════════════════════════════╝');
  console.log(`  🚀 Server đang chạy tại: http://${HOST}:${PORT}`);
  console.log('');
  console.log('  📌 Các liên kết hệ thống:');
  console.log(`  • 🛒 Trang chủ Cửa hàng:     http://${HOST}:${PORT}/`);
  console.log(`  • ⚡ Trang Quản trị (Admin): http://${HOST}:${PORT}/admin/`);
  console.log(`  • 👗 Quản lý Sản phẩm:       http://${HOST}:${PORT}/admin/products.html`);
  console.log(`  • 🔌 API Health:             http://${HOST}:${PORT}/api/health`);
  console.log('');
  console.log('  🔐 Tài khoản Admin mặc định:');
  console.log('  • Email:    admin@lumiere.com');
  console.log('  • Password: admin123');
  console.log('  • Role:     ADMIN');
  console.log('  ─────────────────────────────────────────────────────────');
  console.log('');
});

