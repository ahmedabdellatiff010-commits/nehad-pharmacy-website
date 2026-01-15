function renderProductCard(product) {
  const price = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;


 return `
          <article class="card">
            <div class="card-img">
              <img 
                src="${AppUtils.HTML.escape(imgSrc)}"
                alt="${AppUtils.HTML.escape(product.name)}"
                loading="lazy"
              >
              ${discount > 0 ? `<span class="discount-badge">${discount}%</span>` : ''}
            </div>

            <h3>${AppUtils.HTML.escape(product.name)}</h3>
            <small>${AppUtils.HTML.escape(product.category || '')}</small>
            <p class="desc">${AppUtils.HTML.escape(((full && (full.tagline || full.description)) || product.name || '').toString().substring(0, 60) + '...')}</p>

            <div class="price">
              ${discount > 0 ? `
                <span style="text-decoration:line-through;color:var(--muted);font-weight:400">${price}</span>
                <span>${finalPrice}</span>
              ` : `
                <span>${price}</span>
              `}
            </div>

            <div class="card-actions">
              <button 
                class="btn add-to-cart"
                type="button"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${finalPrice}"
                data-volume="${defaultVolume}"
                data-image="${AppUtils.HTML.escape(imgSrc)}"
                ${(full && (full.stock || full.stock === 0)) ? ((full.stock || 0) <= 0 ? 'disabled' : '') : ''}
              >
              ${((full && (full.stock || full.stock === 0)) ? ((full.stock || 0) > 0 ? 'أضف للسلة' : 'غير متوفر') : 'أضف للسلة')}
              </button>
              <a class="btn btn--ghost" href="product.html?id=${product.id}">التفاصيل</a>
            </div>
          </article>
  `;
}

