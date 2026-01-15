/**
 * Discount Utility Module
 * Centralized discount calculations and price formatting
 */

const DiscountUtils = {
  /**
   * Calculate discounted price based on original price and discount percentage
   * @param {number} price - Original price
   * @param {number} discount - Discount percentage (0-100)
   * @returns {number} Discounted price
   */
  calculateDiscountedPrice(price, discount) {
    if (!price || !discount || discount <= 0) return price;
    const discountAmount = (price * discount) / 100;
    return Math.round((price - discountAmount) * 100) / 100;
  },

  /**
   * Get effective price (considers discount if present)
   * @param {object} product - Product object
   * @returns {number} Effective price (discounted if available, otherwise original)
   */
  getEffectivePrice(product) {
    if (!product) return 0;
    if (product.discount && product.discount > 0) {
      return this.calculateDiscountedPrice(product.price, product.discount);
    }
    return product.price;
  },

  /**
   * Check if product has discount
   * @param {object} product - Product object
   * @returns {boolean}
   */
  hasDiscount(product) {
    return product && product.discount && product.discount > 0;
  },

  /**
   * Get discount percentage string
   * @param {object} product - Product object
   * @returns {string} e.g., "-20%" or empty string
   */
  getDiscountBadge(product) {
    if (!this.hasDiscount(product)) return '';
    return 'SALE';
  },

  /**
   * Get HTML for price display with discount
   * @param {object} product - Product object
   * @returns {string} HTML with original price struck and new price
   */
  getPriceHTML(product) {
    if (!this.hasDiscount(product)) {
      return `<span class="price-current">${product.price} جنيه</span>`;
    }
    
    const originalPrice = product.price;
    const discountedPrice = this.getEffectivePrice(product);
    
    return `
      <span class="price-original">${originalPrice} جنيه</span>
      <span class="price-current">${discountedPrice} جنيه</span>
    `;
  },

  /**
   * Get discount badge HTML
   * @param {object} product - Product object
   * @returns {string} HTML for discount badge or empty string
   */
  getDiscountBadgeHTML(product) {
    if (!this.hasDiscount(product)) return '';
    const badge = this.getDiscountBadge(product);
    return `<span class="discount-badge">${badge}</span>`;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiscountUtils;
}
