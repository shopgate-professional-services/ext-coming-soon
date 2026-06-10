import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { formatAvailableDate } from '../../helpers/isComingSoon';
import { barOpacity } from '../../helpers/barOpacity';

const { colors } = themeConfig;

/**
 * Mirrors the tablet right-column add-to-cart button
 * (ext-tablet-adjustments .../Media/components/AddToCartButton/style.js):
 * CTA colours, fontSize 18, fontWeight 700, radius 5, padding 16, full width.
 * Greyed via the configurable opacity. No bottom-bar container — it sits inline
 * in the right-column CTA box.
 */
const styles = {
  button: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
    background: `var(--color-button-cta, ${colors.cta})`,
    color: `var(--color-button-cta-contrast, ${colors.ctaContrast})`,
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 5,
    padding: 16,
    opacity: barOpacity,
    cursor: 'not-allowed',
  },
};

/**
 * The "available on <date>" bar shown on tablet PDPs in place of the
 * right-column add-to-cart button. Styled identically to that button, greyed.
 * @param {Object} props Component props.
 * @param {Object} props.product Product or selected-variant data.
 */
const ComingSoonBarTablet = ({ product }) => (
  <div
    className="coming-soon-bar coming-soon-bar--tablet"
    style={styles.button}
    data-test-id="comingSoonBarTablet"
  >
    <I18n.Text
      string="ext-coming-soon.available_on"
      params={{ date: formatAvailableDate(product) }}
    />
  </div>
);

ComingSoonBarTablet.propTypes = {
  product: PropTypes.shape(),
};

ComingSoonBarTablet.defaultProps = {
  product: null,
};

export default ComingSoonBarTablet;
