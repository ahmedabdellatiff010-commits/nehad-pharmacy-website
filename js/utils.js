/**
 * Shared Utilities Module
 * Contains reusable functions for storage, UI, and DOM operations
 */

const AppUtils = (function () {
  'use strict';

  /* ===== Storage Operations ===== */
  const Storage = {
    /**
     * Safely read data from localStorage with error handling
     * @param {string} key - Storage key
     * @returns {any} Parsed data or null
     */
    read: function (key) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed;
      } catch (e) {
        console.warn(`Error reading storage key "${key}":`, e);
        return null;
      }
    },

    /**
     * Safely write data to localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} Success status
     */
    write: function (key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn(`Error writing storage key "${key}":`, e);
        return false;
      }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove: function (key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn(`Error removing storage key "${key}":`, e);
        return false;
      }
    }
  };

  /* ===== Notification System ===== */
/* ===== Modern Notification System ===== */
const Notification = (function () {
  let container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function getIcon(type) {
    switch (type) {
      case 'success': return '';
      case 'error': return '';
      case 'info': return '';
      default: return '';
    }
  }
let toastVisible = false;
function show(message, type = 'success', duration = 2500) {
  if (toastVisible) return; // 🔴 يمنع التكرار

  toastVisible = true;

  const toast = document.createElement('div');

  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getIcon(type)}</span>
    <span>${message}</span>
  `;

  getContainer().appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      toast.remove();
      toastVisible = false; // ✅ يسمح بإشعار جديد
    }, 300);

  }, duration);
}

  return { show };
})();
  /* ===== DOM Navigation ===== */
  const Navigation = {
    /**
     * Smooth scroll to top of page
     * @param {number} duration - Animation duration (default: 400ms)
     */
    scrollToTop: function (duration = 400) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Navigate to a URL
     * @param {string} url - URL to navigate to
     */
    navigate: function (url) {
      window.location.href = url;
    },

    /**
     * Get URL search parameter
     * @param {string} param - Parameter name
     * @param {any} defaultValue - Default value if not found
     * @returns {any} Parameter value
     */
    getParam: function (param, defaultValue = null) {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(param);
      return value !== null ? value : defaultValue;
    }
  };

  /* ===== HTML Utilities ===== */
  const HTML = {
    /**
     * Escape HTML special characters
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escape: function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /**
     * Format price in local currency
     * @param {number} price - Price amount
     * @returns {string} Formatted price
     */
    formatPrice: function (price) {
      return Number(price || 0).toFixed(0) + ' جنيه';
    },

    /**
     * Parse price from string
     * @param {string} priceStr - Price string
     * @returns {number} Numeric price
     */
    parsePrice: function (priceStr) {
      return parseFloat((priceStr || '0').replace(/[^0-9.]/g, '')) || 0;
    }
  };

  /* ===== Validation ===== */
  const Validation = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    isValidEmail: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Validate that PRODUCTS data is available
     * @returns {boolean} Is PRODUCTS available
     */
    hasProducts: function () {
      return typeof PRODUCTS !== 'undefined' && PRODUCTS && Object.keys(PRODUCTS).length > 0;
    }
  };

  /* ===== DOM Operations ===== */
  const DOM = {
    /**
     * Query single element
     * @param {string} selector - CSS selector
     * @returns {Element|null} Element or null
     */
    query: function (selector) {
      return document.querySelector(selector);
    },

    /**
     * Query all elements
     * @param {string} selector - CSS selector
     * @returns {NodeList} Elements
     */
    queryAll: function (selector) {
      return document.querySelectorAll(selector);
    },

    /**
     * Add event listener to element
     * @param {Element|string} element - Element or selector
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    on: function (element, event, handler) {
      const el = typeof element === 'string' ? this.query(element) : element;
      if (el) el.addEventListener(event, handler);
    },

    /**
     * Remove class from element
     * @param {Element} el - Element
     * @param {string} className - Class name
     */
    removeClass: function (el, className) {
      if (el) el.classList.remove(className);
    },

    /**
     * Add class to element
     * @param {Element} el - Element
     * @param {string} className - Class name
     */
    addClass: function (el, className) {
      if (el) el.classList.add(className);
    },

    /**
     * Set element text content
     * @param {Element|string} element - Element or selector
     * @param {string} text - Text content
     */
    setText: function (element, text) {
      const el = typeof element === 'string' ? this.query(element) : element;
      if (el) el.textContent = text;
    },

    /**
     * Set element HTML content
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML content
     */
    setHTML: function (element, html) {
      const el = typeof element === 'string' ? this.query(element) : element;
      if (el) el.innerHTML = html;
    },

    /**
     * Set element style property
     * @param {Element|string} element - Element or selector
     * @param {string} property - CSS property
     * @param {string} value - CSS value
     */
    setStyle: function (element, property, value) {
      const el = typeof element === 'string' ? this.query(element) : element;
      if (el) el.style[property] = value;
    }
  };

  /* ===== Debounce ===== */
  const Debounce = {
    /**
     * Create a debounced function
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {Function} Debounced function
     */
    create: function (fn, delay = 300) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  };

  /* ===== Public API ===== */
  return {
    Storage,
    Notification,
    Navigation,
    HTML,
    Validation,
    DOM,
    Debounce
  };
})();
