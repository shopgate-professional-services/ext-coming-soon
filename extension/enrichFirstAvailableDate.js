/**
 * Hooked into `afterFetchProducts` of the catalog pipelines (getProduct,
 * getProductsByCategory, getProductsByIds — see extension-config.json).
 * Receives the mapped products and returns them enriched with a top-level
 * `firstAvailableDate`, which the frontend portals read via isComingSoon().
 *
 * Real source of the date is still an open question (SW6 custom field via
 * customData vs. external API). Until that is modelled, products without a
 * date get a DEV MOCK fallback — REMOVE BEFORE PRODUCTION.
 *
 * @param {Object} context Step context (config, log, ...)
 * @param {Object} input   { products }
 * @param {Function} cb    Callback(err, output)
 */
const DEV_MOCK_FIRST_AVAILABLE_DATE = '2026-12-24'

/**
 * Reads an already-delivered date off the product, if any.
 * @param {Object} product A mapped product.
 * @returns {string|null}
 */
function readDeliveredDate (product) {
  if (product.firstAvailableDate) return product.firstAvailableDate

  let { customData } = product
  if (typeof customData === 'string') {
    try { customData = JSON.parse(customData) } catch (e) { customData = null }
  }
  if (customData && customData.firstAvailableDate) return customData.firstAvailableDate

  return null
}

module.exports = function enrichFirstAvailableDate (context, input, cb) {
  const products = (input.products || []).map(product => ({
    ...product,
    firstAvailableDate: readDeliveredDate(product) || DEV_MOCK_FIRST_AVAILABLE_DATE,
  }))

  cb(null, { products })
}
