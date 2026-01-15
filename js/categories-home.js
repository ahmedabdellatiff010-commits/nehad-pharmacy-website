/**
 * Home Page Categories Loader
 * Loads categories from API and displays them as cards on the home page
 */

document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const categoriesGrid = AppUtils.DOM.query('#categories-grid');
  if (!categoriesGrid) return;

  // Icon mapping for categories
  const icons = {
    skincare: '💧',
    haircare: '💇',
    personal: '✨',
    kids: '👶',
    vitamins: '💊',
    makeup: '💄',
    medical: '🏥',
    offers: '🎁'
  };

  try {
    // Fetch categories from API
    const response = await fetch('http://192.168.1.7:3000/api/categories');
    if (!response.ok) throw new Error('Failed to load categories');
    
    const categories = await response.json();
    
    if (!categories || categories.length === 0) {
      AppUtils.DOM.setHTML(categoriesGrid, '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">لم يتم العثور على أقسام</p>');
      return;
    }

    // Render categories as cards
const html = categories.map(category => `
  <a
    href="shop.html?category=${encodeURIComponent(category.name)}"
    class="category-image-card"
    style="background-image: url('${category.image || 'a'}')"
  >
    <span class="explore-text">استكشف</span>
  </a>
`).join('');

    AppUtils.DOM.setHTML(categoriesGrid, html);
  } catch (err) {
    console.error('Error loading categories:', err);
    AppUtils.DOM.setHTML(categoriesGrid, '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">حدث خطأ في تحميل الأقسام</p>');
  }
});


