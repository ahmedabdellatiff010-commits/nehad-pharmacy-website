/**
 * Shop Page Handler Module
 * Product listing, filtering, sorting, and pagination
 */


const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get('category');

console.log('Selected category:', selectedCategory);





document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const searchInput = AppUtils.DOM.query('#search-input');
  const sortSelect = AppUtils.DOM.query('#sort-select');
  const categoryFilter = AppUtils.DOM.query('#category-filter');
  const productsGrid = AppUtils.DOM.query('#products-grid');
  const paginationEl = AppUtils.DOM.query('#pagination');
  const emptyState = AppUtils.DOM.query('#empty-state');
  const resetBtn = AppUtils.DOM.query('#reset-filters');

  if (!searchInput || !productsGrid) return;

  let allProducts = [];
  let selectedCategory = null;




// اقرأ category من URL
const params = new URLSearchParams(window.location.search);
selectedCategory = params.get('category');
console.log('CATEGORY FROM URL:', selectedCategory);



  const PRODUCTS_PER_PAGE = 12;
  let currentPage = 1;
  let filteredProducts = [];
  let allCategories = [];

  // Load categories from API and render filter buttons
  async function loadCategories() {
    try {
      const response = await fetch('http://192.168.1.7:3000/api/categories');
      if (!response.ok) throw new Error('فشل تحميل الفئات');
      allCategories = await response.json();


// فلترة حسب category من URL
if (selectedCategory) {
  filteredProducts = allProducts.filter(product =>
    product.category &&
    product.category.trim() === selectedCategory.trim()
  );
} else {
  filteredProducts = [...allProducts];
}


      if (!categoryFilter || !allCategories.length) return;

      // Check if mobile screen (max-width: 520px)
      const isMobile = window.innerWidth <= 520;
      let html = '';

      if (isMobile) {
        // Render as dropdown select on mobile
        html = `<select id="category-select" class="category-select" aria-label="اختر الفئة">
          <option value="">جميع الفئات</option>
          ${allCategories.map(cat => `
            <option value="${AppUtils.HTML.escape(cat.name)}">
              ${AppUtils.HTML.escape(cat.name)}
            </option>
          `).join('')}
        </select>`;
      } else {
        // Render as buttons on desktop/tablet
        const grouped = [];
        for (let i = 0; i < allCategories.length; i += 3) {
          grouped.push(allCategories.slice(i, i + 3));
        }

        html = grouped.map(group => `
          <div class="category-group">
            ${group.map(cat => `
              <button class="category-btn" data-category="${AppUtils.HTML.escape(cat.name)}">
                ${AppUtils.HTML.escape(cat.name)}
              </button>
            `).join('')}
          </div>
        `).join('');
      }

      AppUtils.DOM.setHTML(categoryFilter, html);AppUtils.DOM.setHTML(categoryFilter, html);

// ✅ دي الإضافة
if (selectedCategory) {
  const select = document.getElementById('category-select');
  if (select) {
    select.value = selectedCategory;
  }
}
      
      // Attach event listeners based on view type
      if (isMobile) {
        const select = categoryFilter.querySelector('#category-select');
        if (select) {
          select.addEventListener('change', function () {
            selectedCategory = this.value || null;
            filterAndSort();
          });
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  // Load products from API
  async function loadProducts() {
    try {
      const products = await ProductManager.getAll(true); // Force fresh API call
      allProducts = products || [];
      if (allProducts.length === 0) {
        AppUtils.DOM.setHTML(productsGrid, '<div style="padding:40px;text-align:center;grid-column:1/-1"><p>عذراً، حدث خطأ في تحميل المنتجات.</p></div>');
        return;
      }
      filterAndSort();
    } catch (err) {
      console.error('Error loading products:', err);
      AppUtils.DOM.setHTML(productsGrid, '<div style="padding:40px;text-align:center;grid-column:1/-1"><p>عذراً، فشل تحميل المنتجات.</p></div>');
    }
  }

  /**
   * Render product grid with pagination
   */
  function renderProducts(products, page = 1) {
    filteredProducts = products;
    currentPage = page;

    if (!products.length) {
      AppUtils.DOM.setHTML(productsGrid, '');
      AppUtils.DOM.setStyle(paginationEl, 'display', 'none');
      AppUtils.DOM.setStyle(emptyState, 'display', 'block');
      return;
    }

    AppUtils.DOM.setStyle(emptyState, 'display', 'none');

    const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
    const endIdx = startIdx + PRODUCTS_PER_PAGE;
    const pageProducts = products.slice(startIdx, endIdx);
const ITEMS_PER_ROW = 5;
let html = '';

for (let i = 0; i < pageProducts.length; i += ITEMS_PER_ROW) {
  const rowProducts = pageProducts.slice(i, i + ITEMS_PER_ROW);

  html += `
    <div class="product-row">
      ${rowProducts.map(product => {
        const price = product.price || 0;
        const discount = product.discount || 0;
        const finalPrice = discount > 0
          ? Math.round(price * (1 - discount / 100))
          : price;
        const defaultVolume = product.defaultVolume || product.volumes?.[0] || '';
        const imgSrc = product.image ? product.image : 'assets/bottle.svg';

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
      }).join('')}
    </div>
  `;
}

productsGrid.innerHTML = html;
// Make entire product card clickable (except buttons)
document.addEventListener('click', function (e) {
  const card = e.target.closest('.product-card');
  if (!card) return;

  // لو الضغط على زر أو كنترول كمية → تجاهل
  if (
    e.target.closest('button') ||
    e.target.closest('.qty-btn') ||
    e.target.closest('.add-to-cart')
  ) {
    return;
  }

  const id = card.dataset.id;
  if (id) {
    window.location.href = `product.html?id=${id}`;
  }
});

    AppUtils.DOM.setHTML(productsGrid, html);

    // Attach quantity control handlers
    document.querySelectorAll('.product-card').forEach(card => {
      const qtyValue = card.querySelector('.qty-value');
      const decBtn = card.querySelector('.qty-btn[data-action="dec"]');
      const incBtn = card.querySelector('.qty-btn[data-action="inc"]');
      const addBtn = card.querySelector('.add-to-cart');
      
      // Get product stock from data attribute on add-to-cart button
      const productId = addBtn?.dataset.id;
      const product = productId ? allProducts.find(p => p.id === productId) : null;
      const maxStock = product?.stock || 999;

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
          // Don't exceed available stock
          if (qty < maxStock) {
            qty++;
            qtyValue.textContent = qty;
          }
        });

        // Update add-to-cart to use selected quantity (add all at once)
        addBtn.addEventListener('click', (e) => {
          const qty = parseInt(qtyValue.textContent) || 1;
          // Store quantity in data attribute
          addBtn.dataset.qty = qty;
        });
      }
    });

    // Render pagination
    renderPagination(products.length);
  }

  /**
   * Render pagination controls
   */
  function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) {
      AppUtils.DOM.setStyle(paginationEl, 'display', 'none');
      return;
    }

    AppUtils.DOM.setStyle(paginationEl, 'display', 'flex');

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}">السابق</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages <= 7) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === 2 || i === totalPages - 1) {
          paginationHTML += `<span style="color:var(--muted);padding:10px 4px;">...</span>`;
        }
      }
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}">التالي</button>`;
    }

    AppUtils.DOM.setHTML(paginationEl, paginationHTML);

    // Attach pagination click handlers
    AppUtils.DOM.queryAll('.page-btn', paginationEl).forEach(btn => {
      btn.addEventListener('click', function () {
        const page = parseInt(this.dataset.page);
        renderProducts(filteredProducts, page);
        AppUtils.Navigation.scrollToTop();
      });
    });
  }

  /**
   * Filter and sort products
   */
  function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;

    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.tagline || '').toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply sort
    if (sortValue === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered, 1);
  }
  /**
   * Handle category button clicks (desktop/tablet only)
   */
  if (categoryFilter) {
    document.addEventListener('click', function (ev) {
      const btn = ev.target.closest('.category-btn');
      if (!btn) return;

      AppUtils.DOM.queryAll('.category-btn').forEach(b => AppUtils.DOM.removeClass(b, 'active'));

      if (btn.dataset.category === selectedCategory) {
        selectedCategory = null;
      } else {
        AppUtils.DOM.addClass(btn, 'active');
        selectedCategory = btn.dataset.category || null;
      }

      filterAndSort();
    });
  }

  // Event listeners
  searchInput.addEventListener('input', filterAndSort);
  sortSelect.addEventListener('change', filterAndSort);
  resetBtn.addEventListener('click', function () {
    searchInput.value = '';
    sortSelect.value = '';
    selectedCategory = null;
    AppUtils.DOM.queryAll('.category-btn').forEach(b => AppUtils.DOM.removeClass(b, 'active'));
    filterAndSort();
  });

  // Initial render - load categories and products from API
  loadCategories();
  loadProducts();
});

