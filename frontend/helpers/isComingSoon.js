/**
 * Helpers for the "coming soon" availability logic.
 *
 * `firstAvailableDate` is expected on the product (or selected variant) data.
 * The future-check is performed against the device's local clock.
 */

/**
 * Whether a product is "coming soon" — its first availability lies in the future.
 * @param {Object} product Product or selected-variant data.
 * @returns {boolean}
 */
export const isComingSoon = (product) => {
  if (!product || !product.firstAvailableDate) {
    return false;
  }

  const timestamp = new Date(product.firstAvailableDate).getTime();
  if (Number.isNaN(timestamp)) {
    return false;
  }

  return timestamp > Date.now();
};

/**
 * Formats `firstAvailableDate` for display using the device locale.
 * @param {Object} product Product or selected-variant data.
 * @param {string} [locale] Optional BCP-47 locale; defaults to device locale.
 * @returns {string} Localised date, or empty string if unavailable/invalid.
 */
export const formatAvailableDate = (product, locale) => {
  if (!product || !product.firstAvailableDate) {
    return '';
  }

  const date = new Date(product.firstAvailableDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(locale || undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
