/**
 * Recently Viewed Products Manager
 * Stores product snapshots (id, name, price, image, category) in localStorage
 */

const RecentlyViewedManager = (() => {
  const STORAGE_KEY = 'recently_viewed_products';
  const MAX_ITEMS = 10;

  function normalize(item) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'assets/bottle.svg',
      category: item.category || ''
    };
  }

  // Add or move product to front (no duplicates)
  function addToRecentlyViewed(item) {
    if (!item || !item.id) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];

      // Remove any existing with same id
      list = list.filter(i => i.id !== item.id);

      // Insert normalized item at front
      list.unshift(normalize(item));

      // Trim
      list = list.slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('RecentlyViewed: add error', e);
    }
  }

  // Return array of stored product objects
  function getRecentlyViewed() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('RecentlyViewed: read error', e);
      return [];
    }
  }

  function clearRecentlyViewed() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('RecentlyViewed: clear error', e);
    }
  }

  return {
    addToRecentlyViewed,
    getRecentlyViewed,
    clearRecentlyViewed
  };
})();

// Backwards-compatible globals (optional)
window.addToRecentlyViewed = RecentlyViewedManager.addToRecentlyViewed;
window.getRecentlyViewed = RecentlyViewedManager.getRecentlyViewed;
window.clearRecentlyViewed = RecentlyViewedManager.clearRecentlyViewed;
