/**
 * Recently Viewed Section on Home Page
 * Displays recently viewed products
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const recentlyViewedGrid = AppUtils.DOM.query('#recently-viewed-grid');
  const recentlyViewedSection = AppUtils.DOM.query('#recently-viewed');

  if (!recentlyViewedGrid || !recentlyViewedSection) return;

  function renderRecentlyViewed() {
    try {
      const products = RecentlyViewedManager && RecentlyViewedManager.getRecentlyViewed
        ? RecentlyViewedManager.getRecentlyViewed()
        : [];

      if (!products.length) {
        AppUtils.DOM.setStyle(recentlyViewedSection, 'display', 'none');
        return;
      }

      AppUtils.DOM.setStyle(recentlyViewedSection, 'display', 'block');

      const html = products.map(product => {
        // Enrich stored snapshot with canonical product data when available
        const full = (PRODUCTS && PRODUCTS[product.id]) ? PRODUCTS[product.id] : null;
        const price = product.price || (full && ((typeof DiscountUtils !== 'undefined' && DiscountUtils.getEffectivePrice) ? DiscountUtils.getEffectivePrice(full) : full.price)) || 0;
        const discount = full && full.discount ? full.discount : 0;
        const finalPrice = discount > 0
          ? Math.round(price * (1 - discount / 100))
          : price;
        const defaultVolume = (full && (full.defaultVolume || full.volumes?.[0])) || product.defaultVolume || '';
        const imgSrc = product.image || (full && full.image) || 'assets/bottle.svg';
        const stock = full ? (typeof full.stock === 'number' ? full.stock : parseInt(full.stock, 10) || 0) : 0;

        return `
           <article class="product-card"
      data-id="${product.id}">
            <div class="product-image">
              <img 
                src="${AppUtils.HTML.escape(imgSrc)}" 
                alt="${AppUtils.HTML.escape(product.name)}"
                loading="lazy"
              >
              ${discount > 0 ? `<span class="discount-badge">SALE</span>` : ''}
            </div>

            <div class="product-body">
              <h3 class="product-title">${AppUtils.HTML.escape(product.name)}</h3>

              <div class="info-strip">
               
                <span>${defaultVolume || ''}</span>
              </div>

              <div class="rating-strip">
                <span class="stars">
                  ${'⭐'.repeat(Math.floor(product.rating || 0))}
                  ${(product.rating || 0) % 1 >= 0.5 ? '½' : ''}
                </span>
                <span class="rating-value">${(product.rating || 0).toFixed(1)}</span>
                <span class="review-count">(${product.reviewCount || 0})</span>
              </div>

              <div class="card-actions">

                <div class="action-top">
                  <div class="price-section">
                    ${discount > 0 ? `
                      <span class="price-original">${price} جنيه</span>
                      <span class="price-current">${finalPrice} جنيه</span>
                    ` : `
                      <span class="price-current">${price} جنيه</span>
                    `}
                  </div>

               
                </div>

                <div class="action-buttons">




                    <button 
                      class="btn-cart add-to-cart"
                      type="button"
                      data-id="${product.id}"
                      data-name="${product.name}"
                      data-price="${finalPrice}"
                      data-volume="${defaultVolume}"
                      data-image="${AppUtils.HTML.escape(imgSrc)}"
                      ${(product.stock || 0) <= 0 ? 'disabled' : ''}
                    >
                    ${(product.stock || 0) > 0 ? '<img src="image/shopping-cart.svg" width="24" alt="cart">' : '⃠'}
                    </button>

                    <div class="qty-control">
                    <button class="qty-btn" data-action="dec">-</button>
                    <span class="qty-value">1</span>
                    <button class="qty-btn" data-action="inc">+</button>
                  </div>




                </div>

              </div>
            </div>

          </article>
        `;
      }).join('');

      AppUtils.DOM.setHTML(recentlyViewedGrid, html);
    } catch (e) {
      console.error('Error rendering recently viewed:', e);
    }
  }

  // Initial render
  renderRecentlyViewed();

  // Listen for storage changes (when product page is visited)
  window.addEventListener('storage', function (e) {
    if (e.key === 'recently_viewed_products') {
      renderRecentlyViewed();
    }
  });
});
