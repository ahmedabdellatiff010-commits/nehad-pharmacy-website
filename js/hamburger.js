/**
 * Mobile Navigation Handler
 * Hamburger menu toggle and mobile nav functionality
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const hamburger = AppUtils.DOM.query('#hamburger');
  const navMenu = AppUtils.DOM.query('#nav-menu');

  if (!hamburger || !navMenu) return;

  /**
   * Close mobile menu
   */
  function closeMenu() {
    AppUtils.DOM.removeClass(hamburger, 'active');
    AppUtils.DOM.removeClass(navMenu, 'active');
    AppUtils.DOM.removeClass(document.body, 'nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Toggle mobile menu
   */
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (hamburger.classList.contains('active')) {
      closeMenu();
    } else {
      AppUtils.DOM.addClass(hamburger, 'active');
      AppUtils.DOM.addClass(navMenu, 'active');
      AppUtils.DOM.addClass(document.body, 'nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });

  // Close menu when a nav link is clicked
  AppUtils.DOM.queryAll('a', navMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && AppUtils.DOM.query('.active') === navMenu) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
      hamburger.focus();
    }
  });
});
