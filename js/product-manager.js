/**
 * Product Manager Module
 * Handles product-related operations and utilities
 * Fetches from backend API with local fallback
 */

const ProductManager = (function () {
  'use strict';

  let productsCache = null;
  const API_BASE = 'http://192.168.1.7:3000/api';

  /**
   * Fetch products from backend API or return cached data
   * @param {boolean} forceRefresh - Force fresh API call
   * @returns {Promise<Array>} All products
   */
  async function getAll(forceRefresh = false) {
    try {
      if (productsCache && !forceRefresh) {
        return productsCache;
      }

      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const products = await response.json();
      productsCache = Array.isArray(products) ? products : Object.values(products);
      return productsCache;
    } catch (err) {
      console.warn('API error, using local products:', err);
      // Fallback to hardcoded data if API fails
      if (typeof PRODUCTS !== 'undefined' && PRODUCTS) {
        const local = Array.isArray(PRODUCTS) ? PRODUCTS : Object.values(PRODUCTS);
        productsCache = local;
        return local;
      }
      return [];
    }
  }

  /**
   * Get products synchronously (uses cache, avoid in initial load)
   * @returns {Array} All products from cache
   */
  function getAllSync() {
    return productsCache || [];
  }

  /**
   * Validate products data exists
   * @returns {boolean} Is data available
   */
  function hasData() {
    return (productsCache && productsCache.length > 0) || 
           (typeof PRODUCTS !== 'undefined' && Object.keys(PRODUCTS).length > 0);
  }

  /**
   * Get product by ID (use async version when possible)
   * @param {string} id - Product ID
   * @returns {Object|null} Product object or null
   */
  async function getById(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error(`Product not found: ${id}`);
      return await response.json();
    } catch (err) {
      console.warn(`API error getting product ${id}:`, err);
      // Fallback to local data
      const products = await getAll();
      return products.find(p => p.id === id) || null;
    }
  }

  /**
   * Get products by category (async version)
   * @param {string} category - Category name
   * @returns {Promise<Array>} Products in category
   */
  async function getByCategory(category) {
    const products = await getAll();
    return products.filter(p => p.category === category);
  }

  /**
   * Get bestselling products (async version)
   * @returns {Promise<Array>} Bestselling products
   */
  async function getBestsellers() {
    const products = await getAll();
    return products.filter(p => p.isBestSeller);
  }

  /**
   * Search products
   * @param {string} term - Search term
   * @param {Array} products - Products to search in (uses cached if not provided)
   * @returns {Promise<Array>} Matching products
   */
  async function search(term, products = null) {
    if (!term) return [];
    const lowerTerm = term.toLowerCase();
    const list = products || await getAll();
    return list.filter(p =>
      p.name.toLowerCase().includes(lowerTerm) ||
      p.tagline.toLowerCase().includes(lowerTerm) ||
      (p.description || '').toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Get unique categories
   * @returns {Promise<Array>} Category names
   */
  async function getCategories() {
    const products = await getAll();
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories);
  }

  /**
   * Get product details based on category
   * @param {Object} product - Product object
   * @returns {Object} Details object with benefits, howToUse, suitableFor, brandInfo
   */
  function getDetails(product) {
    if (!product) return { benefits: [], howToUse: '', suitableFor: '', brandInfo: '' };

    const category = product.category;

    // Benefits from notes
    const benefits = product.notes?.heart || [];

    // How to use based on category
    let howToUse = '';
    switch (category) {
      case 'العناية بالبشرة':
        howToUse = 'ضع المنتج على البشرة النظيفة بحركات دائرية لطيفة. اتركه لامتصاصه وتجنب منطقة العينين.';
        break;
      case 'العناية بالشعر':
        howToUse = 'ضع المنتج على الشعر الرطب وافرك بلطف. اتركه لبضع دقائق ثم اشطفه جيداً.';
        break;
      case 'العناية الشخصية':
        howToUse = 'استخدم المنتج حسب التعليمات على العبوة. اتبع التعليمات اليومية للحصول على أفضل النتائج.';
        break;
      case 'منتجات الأطفال':
        howToUse = 'خاص للأطفال - استخدم حسب التعليمات. تجنب الاتصال المباشر بالعينين.';
        break;
      case 'المكياج':
        howToUse = 'طبق المنتج بحذر على الوجه النظيف. استخدم الأدوات المناسبة للتطبيق المثالي.';
        break;
      case 'الصحة الطبية':
        howToUse = 'اتبع التعليمات الطبية بدقة. استشر الطبيب في حالة الالتهاب.';
        break;
      default:
        howToUse = 'اتبع التعليمات على العبوة للاستخدام الأمثل.';
    }

    // Suitable for based on category
    let suitableFor = '';
    switch (category) {
      case 'العناية بالبشرة':
        suitableFor = 'مناسب لجميع أنواع البشرة بما فيها البشرة الحساسة';
        break;
      case 'العناية بالشعر':
        suitableFor = 'مناسب لجميع أنواع الشعر والاستخدام اليومي';
        break;
      case 'العناية الشخصية':
        suitableFor = 'مناسب للاستخدام اليومي والعناية الشخصية';
        break;
      case 'منتجات الأطفال':
        suitableFor = 'آمن تماماً للأطفال وتم اختباره من قبل أطباء الأطفال';
        break;
      case 'المكياج':
        suitableFor = 'مناسب لجميع أنواع البشرة والمناسبات المختلفة';
        break;
      case 'الصحة الطبية':
        suitableFor = 'معتمد طبياً وآمن للاستخدام المنزلي';
        break;
      default:
        suitableFor = 'مناسب لجميع الاستخدامات';
    }

    // Brand info
    const brandInfo = `منتج من صيدلية NEHAD ABDELRAMAN المعروفة بجودتها العالية والمنتجات الآمنة. موثوق من آلاف العملاء.`;

    return {
      benefits,
      howToUse,
      suitableFor,
      brandInfo
    };
  }

  /* ===== Public API ===== */
  return {
    hasData,
    getById,
    getAll,
    getAllSync,
    getByCategory,
    getBestsellers,
    search,
    getCategories,
    getDetails
  };
})();
