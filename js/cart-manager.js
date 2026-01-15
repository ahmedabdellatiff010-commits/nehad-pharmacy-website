/**
 * Cart Manager Module
 * Handles all cart-related operations and state management
 */

const CartManager = (function () {
  'use strict';

  const CART_KEY = 'elegance_cart_v1';
  let cartData = [];

  /**
   * Initialize cart from storage
   */
  function init() {
    const stored = AppUtils.Storage.read(CART_KEY);
    cartData = Array.isArray(stored) ? stored : [];
  }

  /**
   * Get all cart items
   * @returns {Array} Cart items
   */
  function getCart() {
    return cartData;
  }

  /**
   * Find item index in cart by ID and volume
   * @param {string} id - Product ID
   * @param {string} volume - Product volume
   * @returns {number} Item index or -1
   */
  function findItemIndex(id, volume) {
    return cartData.findIndex(i => i.id === id && (i.volume || '') === (volume || ''));
  }

  /**
   * Add item to cart
   * @param {Object} item - Item object {id, name, price, volume, qty, image}
   * @returns {boolean} Success status
   */
  function addItem(item) {
    if (!item.id) return false;

    const idx = findItemIndex(item.id, item.volume);
    if (idx > -1) {
      cartData[idx].qty += item.qty || 1;
      AppUtils.Notification.show(`تم تحديث ${item.name} ✓`);
    } else {
      cartData.push({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        volume: item.volume,
        qty: item.qty || 1,
        image: item.image || 'assets/bottle.svg'
      });
      // Notification on add-to-cart intentionally removed per UX request
    }

    return save();
  }

  /**
   * Update item quantity
   * @param {number} index - Item index
   * @param {number} qty - New quantity
   * @returns {boolean} Success status
   */
  function updateItemQty(index, qty) {
    if (cartData[index]) {
      cartData[index].qty = Math.max(1, qty);
      return save();
    }
    return false;
  }

  /**
   * Remove item from cart
   * @param {number} index - Item index
   * @returns {boolean} Success status
   */
  function removeItem(index) {
    if (cartData[index]) {
      cartData.splice(index, 1);
      return save();
    }
    return false;
  }

  /**
   * Get total quantity
   * @returns {number} Total quantity
   */
  function getTotalQty() {
    return cartData.reduce((sum, item) => sum + (item.qty || 0), 0);
  }

  /**
   * Get total price
   * @returns {number} Total price
   */
  function getTotalPrice() {
    return cartData.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  /**
   * Clear cart
   * @returns {boolean} Success status
   */
  function clear() {
    cartData = [];
    return AppUtils.Storage.remove(CART_KEY);
  }

  /**
   * Save cart to storage
   * @returns {boolean} Success status
   */
  function save() {
    return AppUtils.Storage.write(CART_KEY, cartData);
  }

  /* ===== Public API ===== */
  return {
    init,
    getCart,
    findItemIndex,
    addItem,
    updateItemQty,
    removeItem,
    getTotalQty,
    getTotalPrice,
    clear,
    save
  };
})();
