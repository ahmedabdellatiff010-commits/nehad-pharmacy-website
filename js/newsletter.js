/**
 * Newsletter Signup Handler
 * Manages newsletter subscription form
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const newsletterForm = AppUtils.DOM.query('.newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function (ev) {
    ev.preventDefault();

    const emailInput = AppUtils.DOM.query('input[type="email"]', this);
    const submitBtn = AppUtils.DOM.query('button[type="submit"]', this);
    const originalText = submitBtn.textContent;
    const email = (emailInput.value || '').trim();

    // Validate email
    if (!email || !AppUtils.Validation.isValidEmail(email)) {
      AppUtils.Notification.show('يرجى إدخال بريد إلكتروني صحيح');
      AppUtils.DOM.addClass(emailInput, 'error');
      setTimeout(() => AppUtils.DOM.removeClass(emailInput, 'error'), 500);
      return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري...';

    // Simulate API call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      emailInput.value = '';
      AppUtils.Notification.show('شكراً! تم اشتراكك في النشرة البريدية ✓');
    }, 800);
  });
});
