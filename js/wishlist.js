/**
 * Wishlist Handler Module
 * UI logic for wishlist/favorites functionality
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  WishlistManager.init();

  /**
   * Handle wishlist button clicks (heart icons)
   */
  document.addEventListener('click', async function (ev) {
    const btn = ev.target.closest('.wishlist-btn');
    if (!btn) return;
    ev.preventDefault();

    const productId = btn.dataset.id;
    const productName = btn.dataset.name;

    if (!productId || !ProductManager.hasData()) return;

    try {
      const product = await ProductManager.getById(productId);
      if (!product) return;

      const isAdded = WishlistManager.toggle(productId, product);

      if (isAdded) {
        AppUtils.DOM.addClass(btn, 'active');
        btn.setAttribute('aria-pressed', 'true');
        AppUtils.Notification.show(`تم إضافة ${productName} للمفضلة ❤️`);
      } else {
        AppUtils.DOM.removeClass(btn, 'active');
        btn.setAttribute('aria-pressed', 'false');
        AppUtils.Notification.show(`تم إزالة ${productName} من المفضلة`);
      }
    } catch (err) {
      console.error('Error toggling wishlist item', err);
    }
  });

  /**
   * Render wishlist page
   */
  const wishlistRoot = AppUtils.DOM.query('#wishlist-root');

  function renderWishlistPage() {
    if (!wishlistRoot) return;

    const wishlist = WishlistManager.getWishlist();

    if (!wishlist.length) {
      AppUtils.DOM.setHTML(wishlistRoot, `
        <div class="wishlist-empty">
          <div style="font-size:48px;margin-bottom:12px">💔</div>
          <h2>قائمة المفضلة فارغة</h2>
          <p style="color:var(--muted);margin-bottom:18px">لم تضف أي منتجات للمفضلة حتى الآن.</p>
          <a class="btn btn--ghost" href="shop.html">تصفح المنتجات</a>
        </div>
      `);
      return;
    }

    const itemsHtml = wishlist.map(item => `
      <article class="wishlist-item">
        <div class="wishlist-item-img">
          <img src="${AppUtils.HTML.escape(item.image || 'assets/bottle.svg')}" alt="${AppUtils.HTML.escape(item.name)}">
        </div>
        <div class="wishlist-item-body">
          <h3>${AppUtils.HTML.escape(item.name)}</h3>
          <p class="wishlist-item-tag">${AppUtils.HTML.escape(item.category)}</p>
          <p class="wishlist-item-desc">${AppUtils.HTML.escape(item.tagline)}</p>
          <p class="wishlist-item-price">${AppUtils.HTML.formatPrice(item.price)}</p>
        </div>
        <div class="wishlist-item-actions">
          <a href="product.html?id=${item.id}" class="btn btn--small">عرض التفاصيل</a>
          <button class="wishlist-remove-btn" data-id="${item.id}" aria-label="إزالة من المفضلة">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </article>
    `).join('');

    AppUtils.DOM.setHTML(wishlistRoot, `
      <div class="wishlist-header">
        <h1>قائمة المفضلة</h1>
        <p class="wishlist-count">${wishlist.length} منتج</p>
      </div>
      <div class="wishlist-items">
        ${itemsHtml}
      </div>
    `);

    // Attach remove handlers
    AppUtils.DOM.queryAll('.wishlist-remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const productId = this.dataset.id;
        const item = wishlist.find(w => w.id === productId);
        WishlistManager.remove(productId);
        AppUtils.Notification.show(`تم إزالة ${item.name} من المفضلة`);
        setTimeout(() => {
          AppUtils.Navigation.scrollToTop();
          location.reload();
        }, 300);
      });
    });
  }

  // Initial renders
  renderWishlistPage();
  WishlistManager.updateHeartIcons();
});
