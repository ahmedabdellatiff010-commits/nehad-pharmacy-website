/**
 * Cart Handler Module
 * UI logic for displaying and managing the shopping cart
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Initialize managers safely
  try {
    if (typeof CartManager !== 'undefined' && CartManager.init) CartManager.init();
    if (typeof WishlistManager !== 'undefined' && WishlistManager.init) WishlistManager.init();
  } catch (e) {
    console.error('Error initializing managers:', e);
  }

  const countEl = AppUtils.DOM.query('.cart-count');

  /**
   * Render cart count badge in header
   */
  function renderCount() {
    if (!countEl) return;
    try {
      const qty = CartManager && CartManager.getTotalQty ? CartManager.getTotalQty() : 0;
      AppUtils.DOM.setText(countEl, String(qty));
      AppUtils.DOM.addClass(countEl, 'pulse');
      setTimeout(() => AppUtils.DOM.removeClass(countEl, 'pulse'), 220);
    } catch (e) {
      console.warn('Error rendering count:', e);
    }
  }

  /**
   * Parse item data from button attributes
   */
  function parseItemFromButton(btn) {
    const id = btn.dataset.id || btn.getAttribute('data-id');
    const name = btn.dataset.name || btn.getAttribute('data-name') || 'Item';
    const price = AppUtils.HTML.parsePrice(btn.dataset.price || btn.getAttribute('data-price'));
    let volume = btn.dataset.volume || btn.getAttribute('data-volume') || '';
    const image = btn.dataset.image || btn.getAttribute('data-image') || '';
    const qty = parseInt(btn.dataset.qty) || 1;

    const productSection = btn.closest('.product-page');
    if (productSection) {
      const selected = productSection.querySelector('.size-option[aria-pressed="true"]');
      if (selected) volume = selected.textContent.trim();
    }

    return { id, name, price, volume, qty, image };
  }

  /**
   * Handle add-to-cart button click
   */
  let addToCartCooldown = new Set();
  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest('.add-to-cart');
    if (!btn) return;
    ev.preventDefault();

    if (btn.disabled || addToCartCooldown.has(btn)) return;

    btn.disabled = true;
    addToCartCooldown.add(btn);
    setTimeout(() => {
      btn.disabled = false;
      addToCartCooldown.delete(btn);
    }, 600);

    const item = parseItemFromButton(btn);
    if (CartManager.addItem(item)) {
      renderCount();
      renderCartPage();
      try {
        const cart = CartManager.getCart();
        const total = CartManager.getTotalPrice ? CartManager.getTotalPrice() : (cart.reduce((s,i)=>s+i.price*i.qty,0));
        // Dispatch a lightweight event for other UI (mini cart) to open
        const ev = new CustomEvent('cart:item-added', { detail: { item, cart, total } });
        window.dispatchEvent(ev);
      } catch (e) {
        console.warn('Failed to dispatch cart:item-added event', e);
      }
    }
  });

  // ===== Cart Page Rendering =====

  function renderCartPage() {
    const cartRoot = AppUtils.DOM.query('#cart-root');
    if (!cartRoot) {
      console.warn('Cart root element not found');
      return;
    }

    let cart = [];
    try {
      cart = CartManager && CartManager.getCart ? CartManager.getCart() : [];
    } catch (e) {
      console.error('Error getting cart:', e);
      cart = [];
    }

    if (!cart.length) {
      AppUtils.DOM.setHTML(cartRoot, `
        <div class="cart-empty">
          <p style="font-size:18px;margin-bottom:8px">سلتك فارغة.</p>
          <p style="color:var(--muted);margin-bottom:18px">اكتشف مجموعتنا وأضف أدويتك المفضلة.</p>
          <p><a class="btn btn--ghost" href="shop.html">تصفح المنتجات</a></p>
        </div>
      `);
      return;
    }

    const itemsHtml = cart.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}">
        <div class="cart-item-media"><img src="${AppUtils.HTML.escape(item.image || 'assets/bottle.svg')}" alt="${AppUtils.HTML.escape(item.name)}"></div>
        <div class="cart-item-body">
          <h4>${AppUtils.HTML.escape(item.name)} <small class="muted">${AppUtils.HTML.escape(item.volume || '')}</small></h4>
          <div class="cart-item-meta">${AppUtils.HTML.formatPrice(item.price)}</div>
          <div class="qty-controls">
            <button class="qty-btn decrease" data-idx="${idx}" aria-label="تقليل الكمية">−</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-btn increase" data-idx="${idx}" aria-label="زيادة الكمية">+</button>
            <button class="remove" data-idx="${idx}" aria-label="حذف المنتج">حذف</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${AppUtils.HTML.formatPrice(item.price * item.qty)}</div>
      </div>
    `).join('');

    const total = CartManager.getTotalPrice();

    AppUtils.DOM.setHTML(cartRoot, `
      <div class="cart-list">${itemsHtml}</div>
      <aside class="cart-summary">
        <h3>ملخص الطلب</h3>
        <p class="muted">المجموع</p>
        <p class="total">${AppUtils.HTML.formatPrice(total)}</p>
        <a href="checkout.html" class="btn btn--primary">المتابعة للدفع</a>
      </aside>
    `);
  }

  /**
   * Handle cart item controls
   */
  document.addEventListener('click', function (ev) {
    const inc = ev.target.closest('.qty-btn.increase');
    const dec = ev.target.closest('.qty-btn.decrease');
    const rem = ev.target.closest('.remove');

    if (!(inc || dec || rem)) return;
    ev.preventDefault();

    const idx = Number((inc || dec || rem).dataset.idx);
    const cart = CartManager && CartManager.getCart ? CartManager.getCart() : [];

    if (Number.isNaN(idx) || !cart[idx]) return;

    if (inc) {
      // Check stock limit before increasing quantity
      const product = PRODUCTS && PRODUCTS[cart[idx].id];
      const maxQty = (product && product.stock && product.stock > 0) ? product.stock : 999;
      const newQty = Math.min(cart[idx].qty + 1, maxQty);
      
      if (newQty > cart[idx].qty) {
        CartManager.updateItemQty(idx, newQty);
      } else if (product && product.stock && product.stock > 0) {
        // Max stock reached
        console.log(`Max stock reached: ${maxQty}`);
      }
    } else if (dec) {
      CartManager.updateItemQty(idx, Math.max(1, cart[idx].qty - 1));
    } else if (rem) {
      CartManager.removeItem(idx);
    }

    renderCount();
    renderCartPage();
  });

  // ===== Checkout Page Rendering =====
  function renderCheckout() {
    const checkoutRoot = AppUtils.DOM.query('#checkout-root');
    if (!checkoutRoot) {
      console.warn('Checkout root element not found');
      return;
    }

    let cart = [];
    try {
      cart = CartManager && CartManager.getCart ? CartManager.getCart() : [];
    } catch (e) {
      console.error('Error getting cart:', e);
      cart = [];
    }

    if (!cart.length) {
      AppUtils.DOM.setHTML(checkoutRoot, `
        <div class="cart-empty">
          <p>سلتك فارغة.</p>
          <p style="margin-top:14px"><a class="btn btn--ghost" href="shop.html">العودة للتسوق</a></p>
        </div>
      `);
      return;
    }

    const total = CartManager.getTotalPrice();
    const summaryItems = cart.map(item => `
      <div class="summary-item">
        <span>${AppUtils.HTML.escape(item.name)} (${item.qty}×)</span>
        <span>${AppUtils.HTML.formatPrice(item.price * item.qty)}</span>
      </div>
    `).join('');

    AppUtils.DOM.setHTML(checkoutRoot, `
      <form id="checkout-form" class="checkout-form">
        <div class="form-group">
          <label for="name">الاسم الكامل</label>
          <input id="name" type="text" name="name" placeholder=" مثال : احمد" required>
          <span class="error-text" id="name-error"></span>
        </div>
        <div class="form-group">
          <label for="email">البريد الإلكتروني</label>
          <input id="email" type="email" name="email" placeholder="you@example.com" required>
          <span class="error-text" id="email-error"></span>
        </div>
        <div class="form-group">
          <label for="phone">رقم الهاتف</label>
          <input id="phone" type="tel" name="phone" placeholder="01099...." required>
          <span class="error-text" id="phone-error"></span>
        </div>
        <div class="form-group">
          <label for="address">عنوان التسليم</label>
          <input id="address" type="text" name="address" placeholder="شارع..، حي..، مدينة.." required>
          <span class="error-text" id="address-error"></span>
        </div>
        <button type="submit" class="btn btn--primary">تأكيد الطلب</button>
      </form>
      <aside class="checkout-summary">
        <h3>ملخص الطلب</h3>
        ${summaryItems}
        <div class="summary-total">
          <span>الإجمالي</span>
          <span>${AppUtils.HTML.formatPrice(total)}</span>
        </div>
      </aside>
    `);

    attachCheckoutHandler();
  }

  function attachCheckoutHandler() {
    const form = AppUtils.DOM.query('#checkout-form');
    if (!form) return;

    form.addEventListener('submit', async function (ev) {
      ev.preventDefault();

      AppUtils.DOM.queryAll('.error-text').forEach(el => AppUtils.DOM.setText(el, ''));
      AppUtils.DOM.queryAll('.form-group input').forEach(el => AppUtils.DOM.removeClass(el, 'error'));

      const name = (AppUtils.DOM.query('#name')?.value || '').trim();
      const email = (AppUtils.DOM.query('#email')?.value || '').trim();
      const phone = (AppUtils.DOM.query('#phone')?.value || '').trim();
      const address = (AppUtils.DOM.query('#address')?.value || '').trim();

      let isValid = true;
      const errors = {};

      if (!name) {
        errors.name = 'الاسم مطلوب';
        isValid = false;
      }

      if (!email) {
        errors.email = 'البريد الإلكتروني مطلوب';
        isValid = false;
      } else if (!AppUtils.Validation.isValidEmail(email)) {
        errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
        isValid = false;
      }

      if (!phone) {
        errors.phone = 'رقم الهاتف مطلوب';
        isValid = false;
      }

      if (!address) {
        errors.address = 'العنوان مطلوب';
        isValid = false;
      }

      if (!isValid) {
        Object.keys(errors).forEach(key => {
          const errorEl = AppUtils.DOM.query(`#${key}-error`);
          const inputEl = AppUtils.DOM.query(`#${key}`);
          if (errorEl) AppUtils.DOM.setText(errorEl, errors[key]);
          if (inputEl) AppUtils.DOM.addClass(inputEl, 'error');
        });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري المعالجة...';
      }

      // Get cart items
      const cartItems = CartManager.getCart();
      const orderData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        items: cartItems,
        total: CartManager.getTotalPrice(),
        status: 'pending'
      };

      try {
        // Send order to API
        const response = await fetch('http://192.168.1.7:3000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to create order');

        // Clear cart after successful order
        CartManager.clear();
        renderCount();
        AppUtils.Navigation.scrollToTop();

        // Get checkout root for success message
        const checkoutRootEl = AppUtils.DOM.query('#checkout-root');
        if (checkoutRootEl) {
          AppUtils.DOM.setHTML(checkoutRootEl, `
            <div class="success-message" style="grid-column: 1 / -1;">
              <h3>تم تأكيد الطلب بنجاح ✓</h3>
              <p style="margin-bottom:8px">شكراً لطلبك، ${AppUtils.HTML.escape(name)}!</p>
              <p style="color:var(--muted);font-size:14px;margin-bottom:18px">تم إرسال رسالة تأكيد إلى ${AppUtils.HTML.escape(email)}. سيتم توصيل الطلب خلال ساعات قليلة.</p>
              <p><a class="btn btn--ghost" href="shop.html">العودة للتسوق</a></p>
            </div>
          `);
        }
      } catch (err) {
        console.error('Error creating order:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'تأكيد الطلب';
        }
        AppUtils.Notification.show('حدث خطأ في معالجة الطلب. حاول مرة أخرى.');
      }
    });
  }

  renderCount();
  renderCartPage();
  renderCheckout();
});
