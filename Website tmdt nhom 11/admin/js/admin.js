/**
 * LUMIÈRE ADMIN DASHBOARD - CORE JAVASCRIPT
 */

// ─── Constants & State ─────────────────────────────
const API_BASE = '/api';
const TOKEN_KEY = 'lumiere_admin_token';
const USER_KEY = 'lumiere_admin_user';

let currentUser = null;
let currentProducts = [];
let editingProductId = null;

// ─── Auth Helpers ──────────────────────────────────
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  currentUser = user;
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentUser = null;
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (e) {
    return null;
  }
}

// ─── API Client ───────────────────────────────────
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();

    if (res.status === 401 || res.status === 403) {
      // Token hết hạn hoặc không có quyền Admin
      if (token && res.status === 403) {
        showToast('Tài khoản của bạn không có quyền Quản trị viên (ADMIN)!', 'error');
      }
      clearAuth();
      showLoginModal(true);
      throw new Error(data.message || 'Phiên làm việc đã hết hạn');
    }

    if (!res.ok) {
      throw new Error(data.message || 'Lỗi khi gọi API');
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

// ─── Formatters ────────────────────────────────────
function formatVND(amount) {
  const val = Number(amount) || 0;
  return Math.round(val).toLocaleString('vi-VN') + '₫';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ─── Toast Notifications ──────────────────────────
function showToast(message, type = 'default', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

// ─── Authentication Modal & Flows ─────────────────
function renderLoginModal() {
  if (document.getElementById('adminLoginModal')) return;

  const modalHtml = `
    <div class="modal-overlay" id="adminLoginModal">
      <div class="modal-card" style="max-width: 440px;">
        <div class="modal-header">
          <h3 class="modal-title">🔐 Đăng nhập Quản trị viên</h3>
        </div>
        <div class="modal-body">
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem">
            Vui lòng đăng nhập với tài khoản có quyền <strong>ADMIN</strong> để tiếp tục sử dụng hệ thống.
          </p>
          <form id="adminLoginForm">
            <div class="form-group">
              <label class="form-label">Email quản trị</label>
              <input type="email" id="loginEmail" class="form-input" value="admin@lumiere.com" required placeholder="admin@lumiere.com">
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input type="password" id="loginPassword" class="form-input" value="admin123" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%;margin-top:0.5rem" id="btnLoginSubmit">
              Đăng nhập ngay
            </button>
          </form>
          <div style="margin-top:1.25rem;padding:0.75rem;background:#f9fafb;border-radius:6px;font-size:0.78rem;color:#4b5563;border:1px dashed #d1d5db">
            💡 <strong>Tài khoản Demo có sẵn:</strong><br>
            Email: <code>admin@lumiere.com</code> | Pass: <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('adminLoginForm').addEventListener('submit', handleLoginSubmit);
}

function showLoginModal(force = false) {
  renderLoginModal();
  const modal = document.getElementById('adminLoginModal');
  if (modal) {
    if (force || !getToken()) {
      modal.classList.add('open');
    } else {
      modal.classList.remove('open');
    }
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnLoginSubmit');
  btn.disabled = true;
  btn.innerText = 'Đang xác thực...';

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

    if (data.user.role !== 'ADMIN') {
      throw new Error('Tài khoản này không có quyền Quản trị viên (ADMIN)!');
    }

    setAuth(data.token, data.user);
    showToast('Đăng nhập thành công! Chào mừng ' + data.user.name, 'success');

    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.remove('open');

    updateUserInfoUI();
    initCurrentPage();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Đăng nhập ngay';
  }
}

function updateUserInfoUI() {
  const user = getStoredUser();
  if (!user) return;

  const nameEl = document.querySelector('.admin-user-name');
  const roleEl = document.querySelector('.admin-user-role');
  const avatarEl = document.querySelector('.admin-avatar');

  if (nameEl) nameEl.textContent = user.name || 'Admin';
  if (roleEl) roleEl.textContent = user.role || 'ADMIN';
  if (avatarEl && user.avatar) avatarEl.src = user.avatar;
}

function logout() {
  clearAuth();
  showToast('Đã đăng xuất thành công', 'default');
  showLoginModal(true);
}

// ─── Dashboard Logic (admin/index.html) ────────────
async function loadDashboardStats() {
  try {
    const res = await apiRequest('/orders/stats');
    if (!res.success) return;

    const stats = res.stats;

    // Render Stats
    const elRevenue = document.getElementById('statTotalRevenue');
    const elOrders = document.getElementById('statTotalOrders');
    const elProducts = document.getElementById('statTotalProducts');
    const elCustomers = document.getElementById('statTotalCustomers');

    if (elRevenue) elRevenue.textContent = formatVND(stats.totalRevenue);
    if (elOrders) elOrders.textContent = stats.totalOrders;
    if (elProducts) elProducts.textContent = stats.totalProducts;
    if (elCustomers) elCustomers.textContent = stats.totalCustomers;

    // Render Recent Orders Table
    renderRecentOrders(stats.recentOrders || []);
  } catch (err) {
    console.error('Lỗi tải thống kê:', err);
  }
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recentOrdersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Chưa có đơn hàng nào</td></tr>`;
    return;
  }

  const statusBadges = {
    pending: '<span class="badge badge-warning">Chờ xử lý</span>',
    processing: '<span class="badge badge-info">Đang xử lý</span>',
    completed: '<span class="badge badge-success">Hoàn thành</span>',
    cancelled: '<span class="badge badge-danger">Đã hủy</span>'
  };

  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>
        <div style="font-weight:600">${escapeHtml(order.customerName)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${order.customerPhone || order.customerEmail}</div>
      </td>
      <td><strong>${formatVND(order.totalAmount)}</strong></td>
      <td>
        <div style="font-size:0.8rem">${order.paymentMethod || 'COD'}</div>
        <span style="font-size:0.7rem;color:${order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--warning)'}">
          ${order.paymentStatus === 'paid' ? '● Đã thanh toán' : '○ Chưa thanh toán'}
        </span>
      </td>
      <td>${statusBadges[order.status] || order.status}</td>
      <td>
        <select class="filter-select btn-sm" onchange="updateOrderStatus('${order.id}', this.value)" style="padding:0.25rem 0.5rem">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
        </select>
      </td>
    </tr>
  `).join('');
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: newStatus,
        paymentStatus: newStatus === 'completed' ? 'paid' : undefined
      })
    });

    if (res.success) {
      showToast(`Đã cập nhật đơn hàng ${orderId} sang "${newStatus}"`, 'success');
      loadDashboardStats();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ─── Products Logic (admin/products.html) ──────────
async function loadProducts() {
  const searchInput = document.getElementById('productSearchInput');
  const catSelect = document.getElementById('productCategoryFilter');

  const search = searchInput ? searchInput.value.trim() : '';
  const category = catSelect ? catSelect.value : 'all';

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);

  try {
    const res = await apiRequest(`/products?${params.toString()}`);
    if (res.success) {
      currentProducts = res.products;
      renderProductsTable(res.products);
    }
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm:', err);
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  const countEl = document.getElementById('productsCountBadge');
  if (countEl) countEl.textContent = `${products.length} sản phẩm`;
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <h4>Không tìm thấy sản phẩm nào</h4>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm sản phẩm mới.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="product-cell">
          <img src="${p.image || 'https://picsum.photos/seed/shop1/400/500'}" alt="${escapeHtml(p.name)}" class="product-img" onerror="this.src='https://picsum.photos/seed/default/400/500'">
          <div>
            <div class="product-cell-name">${escapeHtml(p.name)}</div>
            <div class="product-cell-cat">ID: <code>${p.id}</code></div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-neutral">${escapeHtml(p.category || 'Chưa phân loại')}</span>
      </td>
      <td>
        <strong>${formatVND(p.price)}</strong>
        ${p.originalPrice && p.originalPrice > p.price ? `<div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through">${formatVND(p.originalPrice)}</div>` : ''}
      </td>
      <td>
        <span style="font-weight:600;color:${p.stock < 10 ? 'var(--danger)' : 'var(--text-main)'}">
          ${p.stock} cái
        </span>
      </td>
      <td>
        ${p.stock > 0 
          ? '<span class="badge badge-success">Còn hàng</span>' 
          : '<span class="badge badge-danger">Hết hàng</span>'}
      </td>
      <td>
        <div style="font-size:0.78rem;color:var(--text-muted)">
          ${p.soldCount || 0} đã bán<br>
          ⭐ ${p.rating || 5.0}
        </div>
      </td>
      <td>
        <div style="display:flex;gap:0.4rem">
          <button class="btn btn-outline btn-sm btn-icon" onclick="openEditProductModal('${p.id}')" title="Chỉnh sửa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteProduct('${p.id}', '${escapeHtml(p.name)}')" title="Xóa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── Product CRUD Modals ──────────────────────────
function openAddProductModal() {
  editingProductId = null;
  const form = document.getElementById('productForm');
  if (form) form.reset();
  
  const title = document.getElementById('productModalTitle');
  if (title) title.textContent = '✨ Thêm Sản Phẩm Mới';

  const modal = document.getElementById('productModal');
  if (modal) modal.classList.add('open');
}

function openEditProductModal(productId) {
  const product = currentProducts.find(p => String(p.id) === String(productId));
  if (!product) return;

  editingProductId = productId;
  const title = document.getElementById('productModalTitle');
  if (title) title.textContent = '✏️ Chỉnh Sửa Sản Phẩm';

  // Fill form inputs
  document.getElementById('prodName').value = product.name || '';
  document.getElementById('prodCategory').value = product.category || 'Women';
  document.getElementById('prodPrice').value = product.price || 0;
  document.getElementById('prodOriginalPrice').value = product.originalPrice || product.price || 0;
  document.getElementById('prodStock').value = product.stock || 0;
  document.getElementById('prodImage').value = product.image || '';
  document.getElementById('prodDesc').value = product.description || '';

  const modal = document.getElementById('productModal');
  if (modal) modal.classList.add('open');
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('open');
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = Number(document.getElementById('prodPrice').value);
  const originalPrice = Number(document.getElementById('prodOriginalPrice').value) || price;
  const stock = Number(document.getElementById('prodStock').value);
  const image = document.getElementById('prodImage').value.trim();
  const description = document.getElementById('prodDesc').value.trim();

  const payload = {
    name,
    category,
    price,
    originalPrice,
    stock,
    image,
    description
  };

  const isEdit = Boolean(editingProductId);
  const endpoint = isEdit ? `/products/${editingProductId}` : '/products';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await apiRequest(endpoint, {
      method,
      body: JSON.stringify(payload)
    });

    if (res.success) {
      showToast(isEdit ? 'Đã cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới thành công!', 'success');
      closeProductModal();
      loadProducts();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function confirmDeleteProduct(id, name) {
  if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID: ${id})?`)) {
    return;
  }

  try {
    const res = await apiRequest(`/products/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast(`Đã xóa sản phẩm thành công!`, 'success');
      loadProducts();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ─── Utility ──────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Page Init Router ─────────────────────────────
function initCurrentPage() {
  updateUserInfoUI();

  // If on Dashboard
  if (document.getElementById('statTotalRevenue')) {
    loadDashboardStats();
  }

  // If on Products Management
  if (document.getElementById('productsTableBody')) {
    loadProducts();

    // Event listeners
    const searchInput = document.getElementById('productSearchInput');
    const catSelect = document.getElementById('productCategoryFilter');
    const productForm = document.getElementById('productForm');

    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(loadProducts, 300);
      });
    }

    if (catSelect) {
      catSelect.addEventListener('change', loadProducts);
    }

    if (productForm) {
      productForm.addEventListener('submit', handleProductFormSubmit);
    }
  }
}

// ─── DOM Ready ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderLoginModal();

  if (!getToken()) {
    showLoginModal(true);
  } else {
    initCurrentPage();
  }

  // Hook logout button
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

