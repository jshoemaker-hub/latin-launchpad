(function () {
  const CONTACT_ENDPOINT = '/api/contact';

  function setStatus(statusElement, message, tone) {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.dataset.tone = tone;
  }

  async function loadFormToken(form) {
    const field = form.elements.namedItem('formToken');
    if (!field) return false;
    try {
      const response = await fetch(CONTACT_ENDPOINT, { headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.token) return false;
      field.value = result.token;
      return true;
    } catch (error) {
      console.warn('Contact token error:', error);
      return false;
    }
  }

  async function sendContactForm(form, statusElement) {
    if (!form) return false;
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      setStatus(statusElement, 'Please complete the required fields first.', 'error');
      return false;
    }

    const tokenField = form.elements.namedItem('formToken');
    if (tokenField && !tokenField.value) {
      const loaded = await loadFormToken(form);
      if (!loaded) {
        setStatus(statusElement, 'Please refresh the page and try again.', 'error');
        return false;
      }
      setStatus(statusElement, 'Please wait a moment and try again.', 'error');
      return false;
    }

    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatus(statusElement, 'Sending...', 'neutral');

    try {
      const formData = new FormData(form);
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Could not send message.');
      }

      form.reset();
      await loadFormToken(form);
      setStatus(statusElement, 'Message sent! We\'ll be in touch.', 'success');
      return true;
    } catch (error) {
      console.warn('Contact form error:', error);
      setStatus(
        statusElement,
        error.message || 'Could not send message. Please email us directly.',
        'error'
      );
      return false;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  window.LatinLaunchpadContact = { CONTACT_ENDPOINT, sendContactForm };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-contact-form]').forEach((form) => {
      const statusElement = document.getElementById(form.dataset.statusTarget || '');
      loadFormToken(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        sendContactForm(form, statusElement);
      });
    });
  });
})();
