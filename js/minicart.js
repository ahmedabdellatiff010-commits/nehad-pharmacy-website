/**
 * Mini Cart Drawer
 * - Listens for `cart:item-added` event or `.add-to-cart` fallback
 * - Injects a bottom drawer showing the added item + cart total
 */
(function () {
  'use strict';

  // Create drawer HTML and append to body
  const template = `
    <div id="mini-cart-backdrop" class="mini-cart-backdrop" aria-hidden="true"></div>
    <aside id="mini-cart" class="mini-cart" aria-hidden="true" role="dialog" aria-label="سلة المشتريات المصغرة">
      <button id="mini-cart-close" class="mini-cart-close" aria-label="إغلاق">×</button>
      <div class="mini-cart-inner">
        <div class="mini-cart-item">
          <img src="assets/bottle.svg" alt="" class="mini-cart-item-img">
          <div class="mini-cart-item-body">
            <div class="mini-cart-item-name"></div>
            <div class="mini-cart-item-meta"><span class="mini-cart-item-qty"></span> × <span class="mini-cart-item-price"></span></div>
          </div>
        </div>
        <div class="mini-cart-summary">
          <div class="mini-cart-total-label">المجموع</div>
          <div class="mini-cart-total-value"></div>
        </div>
        <a href="checkout.html" class="btn btn--primary mini-cart-checkout">الدفع</a>
      </div>
    </aside>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', template);

    const backdrop = document.getElementById('mini-cart-backdrop');
    const drawer = document.getElementById('mini-cart');
    const closeBtn = document.getElementById('mini-cart-close');

    const imgEl = drawer.querySelector('.mini-cart-item-img');
    const nameEl = drawer.querySelector('.mini-cart-item-name');
    const qtyEl = drawer.querySelector('.mini-cart-item-qty');
    const priceEl = drawer.querySelector('.mini-cart-item-price');
    const totalEl = drawer.querySelector('.mini-cart-total-value');

    function openDrawer() {
      backdrop.setAttribute('aria-hidden', 'false');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mini-cart-open');
      // focus close for accessibility
      closeBtn.focus();
    }

    function closeDrawer() {
      backdrop.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mini-cart-open');
    }

    backdrop.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Populate and open when event received
    window.addEventListener('cart:item-added', function (ev) {
      const detail = ev && ev.detail ? ev.detail : null;
      if (!detail) return;
      const item = detail.item || {};
      const total = detail.total || 0;

      imgEl.src = item.image || 'assets/bottle.svg';
      imgEl.alt = item.name || '';
      nameEl.textContent = item.name || '';
      qtyEl.textContent = item.qty || 1;
      priceEl.textContent = typeof item.price === 'number' ? formatPrice(item.price) : item.price;
      totalEl.textContent = formatPrice(total);

      openDrawer();
    });

    // Fallback: when add-to-cart buttons clicked but no event (older pages)
    document.addEventListener('click', function (ev) {
      const btn = ev.target.closest('.add-to-cart');
      if (!btn) return;
      // small timeout to allow CartManager to process
      setTimeout(() => {
        try {
          const CartManager = window.CartManager;
          const cart = CartManager && CartManager.getCart ? CartManager.getCart() : [];
          const total = CartManager && CartManager.getTotalPrice ? CartManager.getTotalPrice() : (cart.reduce((s,i)=>s+i.price*i.qty,0));
          const id = btn.dataset.id;
          const item = cart && cart.length ? cart.find(i => i.id === id) : null;
          if (item) {
            imgEl.src = item.image || 'assets/bottle.svg';
            imgEl.alt = item.name || '';
            nameEl.textContent = item.name || '';
            qtyEl.textContent = item.qty || 1;
            priceEl.textContent = typeof item.price === 'number' ? formatPrice(item.price) : item.price;
            totalEl.textContent = formatPrice(total);
            openDrawer();
          }
        } catch (e) { /* ignore */ }
      }, 120);
    });

    function formatPrice(v) {
      try { return typeof v === 'number' ? v.toLocaleString('ar-EG') + ' جنيه' : v; } catch (e) { return v; }
    }
  });
})();
