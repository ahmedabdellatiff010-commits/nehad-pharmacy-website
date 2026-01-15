/**
 * Wishlist Manager Module
 * Handles all wishlist (favorites) operations and state management
 */

const WishlistManager = (function () {
  'use strict';

  const WISHLIST_KEY = 'elegance_wishlist_v1';
  let wishlistData = [];

  /**
   * Initialize wishlist from storage
   */
  function init() {
    const stored = AppUtils.Storage.read(WISHLIST_KEY);
    wishlistData = Array.isArray(stored) ? stored : [];
  }

  /**
   * Get all wishlist items
   * @returns {Array} Wishlist items
   */
  function getWishlist() {
    return wishlistData;
  }

  /**
   * Check if product is in wishlist
   * @param {string} productId - Product ID
   * @returns {boolean} Is in wishlist
   */
  function isInWishlist(productId) {
    return wishlistData.some(item => item.id === productId);
  }

  /**
   * Add product to wishlist
   * @param {Object} product - Product object from PRODUCTS
   * @returns {boolean} Success status
   */
  function add(product) {
    if (wishlistData.find(item => item.id === product.id)) {
      return false;
    }

    wishlistData.push({
      id: product.id,
      name: product.name,
      price: product.price,
      tagline: product.tagline,
      category: product.category,
      defaultVolume: product.defaultVolume,
      addedAt: new Date().toISOString()
    });

    AppUtils.Notification.show(`تم إضافة ${product.name} للمفضلة ❤️`);
    return save();
  }

  /**
   * Remove product from wishlist
   * @param {string} productId - Product ID
   * @returns {boolean} Success status
   */
  function remove(productId) {
    const item = wishlistData.find(w => w.id === productId);
    if (!item) return false;

    wishlistData = wishlistData.filter(w => w.id !== productId);
    AppUtils.Notification.show(`تم إزالة ${item.name} من المفضلة`);
    return save();
  }

  /**
   * Toggle product in/out of wishlist
   * @param {string} productId - Product ID
   * @param {Object} product - Product object
   * @returns {boolean} Is now in wishlist
   */
  function toggle(productId, product) {
    if (isInWishlist(productId)) {
      remove(productId);
      return false;
    } else {
      add(product);
      return true;
    }
  }

  /**
   * Update heart icon states across the page
   */
  function updateHeartIcons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productId = btn.dataset.id;
      if (isInWishlist(productId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Save wishlist to storage
   * @returns {boolean} Success status
   */
  function save() {
    updateHeartIcons();
    return AppUtils.Storage.write(WISHLIST_KEY, wishlistData);
  }

  /* ===== Public API ===== */
  return {
    init,
    getWishlist,
    isInWishlist,
    add,
    remove,
    toggle,
    updateHeartIcons,
    save
  };
})();
