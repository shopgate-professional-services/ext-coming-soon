/**
 * Helpers for the "coming soon" availability logic.
 *
 * `firstAvailableDate` is expected on the product (or selected variant) data.
 * The future-check is performed against the device's local clock.
 */

/**
 * Parses `firstAvailableDate` into a Date.
 *
 * A date-only string (`"YYYY-MM-DD"`) is parsed as **local** midnight — note
 * `new Date("YYYY-MM-DD")` would parse it as UTC midnight, which (combined with
 * the local `Date.now()` comparison and `toLocaleDateString` display) can shift
 * availability by a day depending on the device timezone. Full datetime strings
 * (with time/offset) are passed through to the native parser unchanged.
 * @param {string} value The raw `firstAvailableDate`.
 * @returns {Date|null} A valid Date, or null.
 */
const parseAvailableDate = (value) => {
  if (!value) {
    return null;
  }

  let date;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Whether a product is "coming soon" — its first availability lies in the future.
 * @param {Object} product Product or selected-variant data.
 * @returns {boolean}
 */
export const isComingSoon = (product) => {
  const date = product ? parseAvailableDate(product.firstAvailableDate) : null;

  return !!date && date.getTime() > Date.now();
};

/**
 * Formats `firstAvailableDate` for display using the device locale.
 * @param {Object} product Product or selected-variant data.
 * @param {string} [locale] Optional BCP-47 locale; defaults to device locale.
 * @returns {string} Localised date, or empty string if unavailable/invalid.
 */
export const formatAvailableDate = (product, locale) => {
  const date = product ? parseAvailableDate(product.firstAvailableDate) : null;
  if (!date) {
    return '';
  }

  return date.toLocaleDateString(locale || undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
