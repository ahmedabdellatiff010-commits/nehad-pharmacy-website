/**
 * Bestsellers Grid Handler
 * Renders bestseller products on home page from API
 */

document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const bestsellersGrid = AppUtils.DOM.query('#bestsellers-grid');
  if (!bestsellersGrid) return;

  /**
   * Render bestseller products
   */
  function renderBestSellers(products) {
    if (!products.length) {
      AppUtils.DOM.setHTML(bestsellersGrid, '');
      return;
    }

    const html = products.map(product => {
      const price = product.price || 0;
      const discount = product.discount || 0;
      const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      const defaultVolume = product.defaultVolume || product.volumes?.[0] || '';
      const imgSrc = product.image ? product.image : 'assets/bottle.svg';

      return `
      <article class="product-card">

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
                <img src="image/shopping-cart.svg" color="white" width="24" alt="cart icon">
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

    AppUtils.DOM.setHTML(bestsellersGrid, html);

    // Attach quantity control handlers
    document.querySelectorAll('.product-card').forEach(card => {
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

  // Load bestsellers from API
  try {
    const allProducts = await ProductManager.getAll(true);
    let bestSellers = allProducts.filter(p => p.isBestSeller);

    // Exclude admin-marked offers from bestsellers on the homepage
    bestSellers = bestSellers.filter(p => !p.isOffer);

    // Fallbacks: if no explicit bestsellers, prefer discounted items, else take first few products
    if (!bestSellers || bestSellers.length === 0) {
      const discounted = allProducts.filter(p => (p.discount || 0) > 0 && !p.isOffer);
      if (discounted && discounted.length) {
        bestSellers = discounted.slice(0, 4);
      } else {
        bestSellers = allProducts.slice(0, 4);
      }
    }

    renderBestSellers(bestSellers);
  } catch (err) {
    console.error('Error loading bestsellers:', err);
    renderBestSellers([]);
  }
});

