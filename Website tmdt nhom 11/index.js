// index.js - LUMIÈRE Fashion Store Server

const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = 'localhost';
const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
  // Normalize URL (remove query strings)
  let urlPath = req.url.split('?')[0];

  // Default to index.html
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, 'public', urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Không tìm thấy trang</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Lỗi server');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  ✨ LUMIÈRE Fashion Store');
  console.log('  ─────────────────────────────────────');
  console.log(`  🌐 http://${HOST}:${PORT}`);
  console.log('');
  console.log('  Pages:');
  console.log(`  • Homepage  → http://${HOST}:${PORT}/`);
  console.log(`  • Shop      → http://${HOST}:${PORT}/shop.html`);
  console.log(`  • Product   → http://${HOST}:${PORT}/product.html`);
  console.log(`  • Cart      → http://${HOST}:${PORT}/cart.html`);
  console.log('  ─────────────────────────────────────');
  console.log('');
});
