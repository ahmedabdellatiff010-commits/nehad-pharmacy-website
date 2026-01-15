/**
 * Offers & Discounts Section Handler
 * Renders discounted products on home page
 * Shows section only if discounted products exist
 */

document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const offersSection = AppUtils.DOM.query('#offers');
  const offersGrid = AppUtils.DOM.query('#offers-grid');
  
  if (!offersSection || !offersGrid) return;

  /**
   * Render offers (only products explicitly marked as offers)
   */
  function renderOffers(products) {
    const now = Date.now();

    // Only show products that are marked as offers and have discount > 0
    const offerProducts = (products || []).filter(p => p.isOffer === true && (p.discount || 0) > 0).filter(p => {
      // honor optional start/end dates
      if (p.offerStart && new Date(p.offerStart).getTime() > now) return false;
      if (p.offerEnd && new Date(p.offerEnd).getTime() < now) return false;
      return true;
    });

    if (!offerProducts.length) {
      AppUtils.DOM.setStyle(offersSection, 'display', 'none');
      return;
    }

    AppUtils.DOM.setStyle(offersSection, 'display', 'block');

    const html = offerProducts.map(product => {
      const price = product.price || 0;
      const discount = product.discount || 0;
      const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      const defaultVolume = product.defaultVolume || product.volumes?.[0] || '';
      const imgSrc = product.image ? product.image : 'assets/bottle.svg';
      const offerEndTs = product.offerEnd ? new Date(product.offerEnd).getTime() : '';

      return `
      <article class="product-card offer-card" data-offer-end="${offerEndTs}">

        <div class="product-image">
          <img 
            src="${AppUtils.HTML.escape(imgSrc)}" 
            alt="${AppUtils.HTML.escape(product.name)}"
            loading="lazy"
          >

          ${discount > 0 ? `<span class="discount-badge">${discount}%</span>` : ''}
          ${offerEndTs ? `<span class="offer-badge">عرض محدود</span>` : ''}
        </div>

        <div class="product-body">
          <h3 class="product-title">${AppUtils.HTML.escape(product.name)}</h3>

          <div class="info-strip">
            <span>${AppUtils.HTML.escape(product.category || '—')}</span>
            <span>${defaultVolume || '—'}</span>
          </div>

          <div class="rating-strip">
            <span class="stars">${'⭐'.repeat(Math.floor(product.rating || 0))}${(product.rating || 0) % 1 >= 0.5 ? '½' : ''}</span>
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

              <div class="qty-control">
                <button class="qty-btn" data-action="dec">-</button>
                <span class="qty-value">1</span>
                <button class="qty-btn" data-action="inc">+</button>
              </div>
            </div>

            <div class="offer-meta">
              <div class="offer-countdown" aria-live="polite">${offerEndTs ? '<span class="countdown">جارٍ التحميل...</span>' : ''}</div>
            </div>

            <div class="action-buttons">
              <button 
                class="btn-cart add-to-cart"
                type="button"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${finalPrice}"
                data-original-price="${price}"
                data-volume="${defaultVolume}"
                data-image="${AppUtils.HTML.escape(imgSrc)}"
              >
                ${product.stock > 0 ? '<img src="image/shopping-cart.svg" color="white" width="24" alt="cart icon">' : 'غير متوفر'}
              </button>

              <a 
                class="btn-outline"
                href="product.html?id=${product.id}"
                aria-label="عرض التفاصيل ${product.name}"
              >
                التفاصيل
              </a>
            </div>

          </div>
        </div>

      </article>
      `;
    }).join('');

    AppUtils.DOM.setHTML(offersGrid, html);

    // Initialize countdowns
    function updateCountdowns() {
      document.querySelectorAll('.offer-card').forEach(card => {
        const end = Number(card.dataset.offerEnd) || 0;
        const el = card.querySelector('.countdown');
        if (!el || !end) return;
        const diff = end - Date.now();
        if (diff <= 0) {
          el.textContent = 'انتهى العرض';
          card.classList.add('offer-expired');
          return;
        }
        const secs = Math.floor(diff / 1000) % 60;
        const mins = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        el.textContent = `${days}ي ${hours}س ${mins}د ${secs}ث`;
      });
    }
    updateCountdowns();
    setInterval(updateCountdowns, 1000);

    // Attach quantity control handlers
    document.querySelectorAll('#offers-grid .product-card').forEach(card => {
      const qtyValue = card.querySelector('.qty-value');
      const decBtn = card.querySelector('.qty-btn[data-action="dec"]');
      const incBtn = card.querySelector('.qty-btn[data-action="inc"]');
      const addBtn = card.querySelector('.add-to-cart');

      if (decBtn && incBtn && qtyValue && addBtn) {
        decBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let qty = parseInt(qtyValue.textContent) || 1;
          if (qty > 1) {
            qty--;
            qtyValue.textContent = qty;
          }
        });

        incBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let qty = parseInt(qtyValue.textContent) || 1;
          qty++;
          qtyValue.textContent = qty;
        });

        // Update add-to-cart to use selected quantity
        addBtn.addEventListener('click', (e) => {
          const qty = parseInt(qtyValue.textContent) || 1;
          addBtn.dataset.qty = qty;
        });
      }
    });
  }

  /**
   * Load products from API or use local PRODUCTS
   */
  async function loadOffers() {
    try {
      // Try to load from API first
      const products = await ProductManager.getAll(true);
      renderOffers(products || []);
    } catch (err) {
      // Fallback to local PRODUCTS
      console.log('Using local products for offers');
      if (typeof PRODUCTS !== 'undefined') {
        const productArray = Object.values(PRODUCTS);
        renderOffers(productArray);
      }
    }
  }

  loadOffers();
});
