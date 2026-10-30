/* ===================================================
   LUMIÈRE – main.js
   =================================================== */

/* ─── State ─────────────────────────────────────── */
let cartItems = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
let wishlist  = JSON.parse(localStorage.getItem('lumiere_wishlist') || '[]');

/* ─── DOM Ready ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncement();
  initStickyHeader();
  initMobileNav();
  initSearchModal();
  initCartDrawer();
  initWishlistButtons();
  initAddToCart();
  initQuantityControls();
  initProductGallery();
  initFilterSidebar();
  initAccordions();
  initNewsletterForm();
  initSizeSelector();
  renderCartBadge();
  initHero();
  initScrollReveal();
});

/* ─── Helpers ────────────────────────────────────── */
function saveCart() {
  localStorage.setItem('lumiere_cart', JSON.stringify(cartItems));
}

function saveWishlist() {
  localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatVND(amount) {
  let val = Number(amount) || 0;
  if (val > 0 && val < 1000) val = val * 25000;
  return Math.round(val).toLocaleString('vi-VN') + '₫';
}

/* ─── Toast Notifications ────────────────────────── */
function showToast(message, type = 'default', duration = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type === 'default' ? '' : type}`;
  toast.innerHTML = `${icons[type] || icons.default}<span>${message}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Animate out & remove
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

/* ─── Announcement Bar ───────────────────────────── */
function initAnnouncement() {
  const closeBtn = document.querySelector('.announcement-bar__close');
  const bar = document.querySelector('.announcement-bar');
  if (!closeBtn || !bar) return;

  closeBtn.addEventListener('click', () => {
    bar.style.height = bar.offsetHeight + 'px';
    bar.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      bar.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      bar.style.height = '0';
      bar.style.opacity = '0';
    });
    bar.addEventListener('transitionend', () => bar.remove());
  });
}

/* ─── Sticky Header ──────────────────────────────── */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ─── Mobile Navigation ──────────────────────────── */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay   = document.querySelector('.mobile-nav__overlay');
  if (!hamburger || !mobileNav) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    toggleMenu(!mobileNav.classList.contains('open'));
  });

  overlay && overlay.addEventListener('click', () => toggleMenu(false));
}

/* ─── Search Modal ───────────────────────────────── */
function initSearchModal() {
  const openBtns  = document.querySelectorAll('[data-search-open]');
  const modal     = document.querySelector('.search-modal');
  const closeBtn  = document.querySelector('.search-modal__close');
  const input     = document.querySelector('.search-modal__input');
  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.classList.contains('search-modal__overlay')) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ─── Cart Drawer ────────────────────────────────── */
function initCartDrawer() {
  const drawer      = document.querySelector('.cart-drawer');
  const overlay     = document.querySelector('.cart-drawer__overlay');
  const openBtns    = document.querySelectorAll('[data-cart-open]');
  const closeBtn    = document.querySelector('.cart-drawer__close');
  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}

function renderCartDrawer() {
  const body   = document.querySelector('.cart-drawer__body');
  const footer = document.querySelector('.cart-drawer__footer');
  if (!body) return;

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="cart-drawer__empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p style="font-size:0.9rem; font-weight:500;">Your bag is empty</p>
        <p style="font-size:0.8rem; color:var(--gray-400);">Add your favourites to get started</p>
        <a href="shop.html" class="btn btn-primary btn-sm" style="margin-top:0.5rem">Start Shopping</a>
      </div>`;
    footer && (footer.style.display = 'none');
    return;
  }

  footer && (footer.style.display = 'flex');
  body.innerHTML = cartItems.map(item => `
    <div class="cart-drawer__item" data-item-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-drawer__item-img" loading="lazy">
      <div class="cart-drawer__item-info">
        <div class="cart-drawer__item-name">${item.name}</div>
        <div class="cart-drawer__item-meta">Size: ${item.size || 'M'} · ${item.color || 'Black'}</div>
        <div class="cart-drawer__item-actions">
          <div class="qty-control">
            <button class="qty-control__btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-control__value">${item.qty}</span>
            <button class="qty-control__btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:0.75rem;text-decoration:underline">Remove</button>
        </div>
        <div class="cart-drawer__item-price">${formatVND(item.price * item.qty)}</div>
      </div>
    </div>
  `).join('');

  const subtotal = cartItems.reduce((sum, i) => {
    let p = Number(i.price) || 0;
    if (p > 0 && p < 1000) p = p * 25000;
    return sum + p * i.qty;
  }, 0);
  const subtotalEl = document.querySelector('.cart-drawer__subtotal-value');
  if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
}

/* ─── Cart Badge ─────────────────────────────────── */
function renderCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const total  = cartItems.reduce((sum, i) => sum + i.qty, 0);
  badges.forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

/* ─── Add to Cart ────────────────────────────────── */
function initAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('[data-product]') || this.closest('.product-card') || this.closest('.product-detail__layout') || document;
      addItemToCart({
        id:    this.dataset.addToCart || generateId(),
        name:  this.dataset.name || card.querySelector('.product-card__name, .product-info__title')?.textContent?.trim() || 'Product',
        price: parseFloat(this.dataset.price || '0'),
        image: this.dataset.image || card.querySelector('img')?.src || 'https://picsum.photos/seed/fashion1/400/500',
        size:  document.querySelector('.size-option.active, .size-pill.active')?.textContent?.trim() || 'M',
        color: document.querySelector('.color-option.active')?.dataset.color || 'Black',
        qty:   1,
      });
    });
  });

  // Product page main "Add to Bag" button
  const addToBagBtn = document.getElementById('addToBagBtn');
  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      const name  = document.querySelector('.product-info__title')?.textContent?.trim();
      const rawPrice = document.querySelector('.product-price__current')?.textContent || '0';
      const price = parseFloat(rawPrice.replace(/[^0-9]/g, '')) || 0;
      const image = document.querySelector('.product-gallery__main-img')?.src;
      const size  = document.querySelector('.size-option.active')?.textContent?.trim() || 'M';
      const color = document.querySelector('.color-option.active')?.dataset.color || 'Black';

      if (!size) { showToast('Please select a size', 'warning'); return; }
      addItemToCart({ id: generateId(), name, price, image, size, color, qty: 1 });
    });
  }
}

function addItemToCart(newItem) {
  const existing = cartItems.find(i => i.name === newItem.name && i.size === newItem.size && i.color === newItem.color);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ ...newItem, id: generateId() });
  }
  saveCart();
  renderCartBadge();
  showToast(`${newItem.name} added to your bag ✓`, 'success');

  // Auto-open cart drawer
  const drawer  = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.cart-drawer__overlay');
  if (drawer) {
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }
}

function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  saveCart();
  renderCartBadge();
  renderCartDrawer();
  renderCartPage();
}

function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCartBadge();
  renderCartDrawer();
  renderCartPage();
}

/* ─── Cart Page ──────────────────────────────────── */
function renderCartPage() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:4rem 0; color:var(--gray-500)">
        <p style="font-size:1.1rem; font-weight:500; margin-bottom:1rem">Your cart is empty</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
    updateOrderSummary();
    return;
  }

  container.innerHTML = `
    <div class="cart-items__header">
      <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span>
    </div>` +
    cartItems.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item__product">
        <img src="${item.image}" alt="${item.name}" class="cart-item__img">
        <div class="cart-item__details">
          <a href="product.html" class="cart-item__name">${item.name}</a>
          <div class="cart-item__meta">
            <span>Size: ${item.size || 'M'}</span>
            <span>Color: ${item.color || 'Black'}</span>
          </div>
          <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
      <div class="cart-item__price">${formatVND(item.price)}</div>
      <div class="qty-control">
        <button class="qty-control__btn" onclick="changeQty('${item.id}', -1)">−</button>
        <span class="qty-control__value">${item.qty}</span>
        <button class="qty-control__btn" onclick="changeQty('${item.id}', 1)">+</button>
      </div>
      <div class="cart-item__total">${formatVND(item.price * item.qty)}</div>
    </div>`).join('');

  updateOrderSummary();
}

function updateOrderSummary() {
  const subtotal = cartItems.reduce((s, i) => {
    let p = Number(i.price) || 0;
    if (p > 0 && p < 1000) p = p * 25000;
    return s + p * i.qty;
  }, 0);
  const freeShipThreshold = 1250000;
  const shipping  = (subtotal >= freeShipThreshold || subtotal === 0) ? 0 : 35000;
  const discount  = 0;
  const total     = subtotal + shipping - discount;

  const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  set('#summarySubtotal', formatVND(subtotal));
  set('#summaryShipping', shipping === 0 ? 'Miễn phí' : formatVND(shipping));
  set('#summaryTotal',    formatVND(total));

  const progress = document.getElementById('shippingProgress');
  if (progress) {
    if (subtotal >= freeShipThreshold) {
      progress.innerHTML = '🎉 Bạn đủ điều kiện nhận <strong>miễn phí vận chuyển!</strong>';
      progress.parentElement.style.background = '#f0fdf4';
      progress.parentElement.style.borderColor = '#bbf7d0';
    } else {
      const diff = formatVND(freeShipThreshold - subtotal);
      progress.innerHTML = `Thêm <strong>${diff}</strong> để được miễn phí vận chuyển!`;
      progress.parentElement.style.background = 'var(--off-white)';
      progress.parentElement.style.borderColor = 'var(--gray-200)';
    }
  }

  const countEl = document.querySelector('.cart-page__count');
  if (countEl) {
    const count = cartItems.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = `${count} sản phẩm`;
  }
}

// Initialize cart page on load
document.addEventListener('DOMContentLoaded', renderCartPage);

/* ─── Wishlist ───────────────────────────────────── */
function initWishlistButtons() {
  document.querySelectorAll('.product-card__wishlist').forEach(btn => {
    const productId = btn.dataset.productId || btn.closest('[data-product-id]')?.dataset.productId || generateId();
    if (!btn.dataset.pid) btn.dataset.pid = productId;

    // Set initial state
    if (wishlist.includes(btn.dataset.pid)) btn.classList.add('wishlisted');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const pid = this.dataset.pid;
      if (wishlist.includes(pid)) {
        wishlist = wishlist.filter(id => id !== pid);
        this.classList.remove('wishlisted');
        showToast('Removed from wishlist', 'default');
      } else {
        wishlist.push(pid);
        this.classList.add('wishlisted');
        showToast('Added to wishlist ♥', 'success');
      }
      saveWishlist();
    });
  });
}

/* ─── Product Image Gallery ──────────────────────── */
function initProductGallery() {
  const mainImg = document.querySelector('.product-gallery__main-img');
  const thumbs  = document.querySelectorAll('.product-gallery__thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function () {
      thumbs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = this.src.replace('w=80', 'w=600');
        mainImg.style.opacity = '1';
      }, 200);
    });
  });
}

/* ─── Quantity Controls (general) ───────────────── */
function initQuantityControls() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.qty-control__btn');
    if (!btn) return;

    const control = btn.closest('.qty-control');
    const display = control.querySelector('.qty-control__value');
    let val = parseInt(display.textContent, 10);

    if (btn.textContent.trim() === '+' || btn.textContent.trim() === '＋') {
      val++;
    } else {
      val = Math.max(1, val - 1);
    }
    display.textContent = val;
  });
}

/* ─── Filter Sidebar Accordion ───────────────────── */
function initFilterSidebar() {
  // Accordion toggle for filter groups
  document.querySelectorAll('.filter-group__header').forEach(header => {
    const group = header.closest('.filter-group');
    header.addEventListener('click', () => {
      group.classList.toggle('open');
    });
    // Open first groups by default
    if (group && ['Category', 'Size', 'Color'].includes(header.querySelector('.filter-group__label')?.textContent)) {
      group.classList.add('open');
    }
  });

  // Size pills
  document.querySelectorAll('.size-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      this.classList.toggle('active');
      updateActiveFilterChips();
    });
  });

  // Color swatches filter
  document.querySelectorAll('.color-swatch-filter').forEach(swatch => {
    swatch.addEventListener('click', function () {
      this.classList.toggle('active');
      updateActiveFilterChips();
    });
  });

  // Mobile filter toggle
  const filterToggle = document.querySelector('.filter-mobile-toggle');
  const filterSidebar = document.querySelector('.filter-sidebar');
  const filterOverlay = document.querySelector('.filter-overlay');

  filterToggle && filterToggle.addEventListener('click', () => {
    filterSidebar && filterSidebar.classList.add('open');
    filterOverlay && filterOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  filterOverlay && filterOverlay.addEventListener('click', () => {
    filterSidebar && filterSidebar.classList.remove('open');
    filterOverlay && filterOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  // Grid toggle
  document.querySelectorAll('.grid-toggle__btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.grid-toggle__btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cols = this.dataset.cols;
      const grid = document.querySelector('.product-grid');
      if (grid && cols) {
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      }
    });
  });
}

function updateActiveFilterChips() {
  const container = document.querySelector('.active-filters');
  if (!container) return;

  const activeSizes = [...document.querySelectorAll('.size-pill.active')].map(p => p.textContent);
  const activeColors = [...document.querySelectorAll('.color-swatch-filter.active')].map(s => s.dataset.color || s.title || 'Color');

  const chips = [...activeSizes.map(s => ({ label: s, type: 'size' })),
                  ...activeColors.map(c => ({ label: c, type: 'color' }))];

  if (chips.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = chips.map(chip => `
    <span class="active-filter-chip" data-type="${chip.type}" data-label="${chip.label}">
      ${chip.label} <span class="active-filter-chip__remove">×</span>
    </span>`).join('');

  container.querySelectorAll('.active-filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      const { type, label } = this.dataset;
      if (type === 'size') {
        document.querySelectorAll('.size-pill').forEach(p => {
          if (p.textContent === label) p.classList.remove('active');
        });
      } else if (type === 'color') {
        document.querySelectorAll('.color-swatch-filter').forEach(s => {
          if ((s.dataset.color || s.title) === label) s.classList.remove('active');
        });
      }
      updateActiveFilterChips();
    });
  });
}

/* ─── Accordion (Product Detail) ─────────────────── */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    const item = header.closest('.accordion-item');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all in same parent
      const siblings = item.parentElement.querySelectorAll('.accordion-item');
      siblings.forEach(s => s.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Open first accordion by default
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) firstAccordion.classList.add('open');
}

/* ─── Size Selector ──────────────────────────────── */
function initSizeSelector() {
  document.querySelectorAll('.size-option').forEach(opt => {
    if (opt.classList.contains('out-of-stock')) return;
    opt.addEventListener('click', function () {
      document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', function () {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ─── Newsletter ─────────────────────────────────── */
function initNewsletterForm() {
  const form    = document.querySelector('.newsletter-form');
  const success = document.querySelector('.newsletter-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]');
    if (!email || !email.value.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      requestAnimationFrame(() => success.classList.add('show'));
    }
    showToast('Welcome to LUMIÈRE! 🎉', 'success');
  });
}

/* ─── Hero Animation ─────────────────────────────── */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(() => hero.classList.add('loaded'), 100);
}

/* ─── Scroll Reveal ──────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }
  `;
  document.head.appendChild(style);

  // Auto-tag animatable elements
  document.querySelectorAll('.product-card, .category-card, .section-title, .section-label, .section-subtitle').forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Promo Code (Cart Page) ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const promoForm = document.querySelector('.promo-form');
  if (!promoForm) return;

  promoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = this.querySelector('.promo-form__input');
    const code = input?.value.trim().toUpperCase();
    if (code === 'STYLE20') {
      showToast('Áp dụng mã thành công! Giảm 20% 🎉', 'success');
      input.value = '';
    } else if (code === 'FREESHIP') {
      showToast('Áp dụng miễn phí vận chuyển thành công!', 'success');
      input.value = '';
    } else {
      showToast('Mã giảm giá không hợp lệ', 'error');
    }
  });
});
