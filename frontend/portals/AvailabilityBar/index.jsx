import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from '../../connector';
import { isComingSoon } from '../../helpers/isComingSoon';
import ComingSoonBar from '../../components/ComingSoonBar';

/**
 * Portal component for `product.add-to-cart-bar.before` (the phone bottom bar).
 *
 * We use the *additive* `.before` slot instead of overriding the bar itself,
 * so we never fight other extensions for the override (e.g. ext-tablet-adjustments
 * also registers at `product.add-to-cart-bar` and would otherwise win by
 * registration order). For coming-soon products we render the availability bar
 * here and hide the real add-to-cart bar (`.theme__product__add-to-cart-bar`)
 * via a scoped style. This is order-independent and self-cleaning (the style is
 * gone as soon as the component unmounts / the product is no longer coming-soon).
 *
 * On tablet the add-to-cart lives in the right column, so this renders nothing.
 * @param {Object} props Component props.
 * @param {Object} props.product Product or selected-variant data.
 * @param {boolean} props.isTablet Whether the device is a tablet.
 * @returns {JSX.Element|null} The phone availability bar, or null.
 */
const AvailabilityBar = ({ product, isTablet }) => {
  if (isTablet || !isComingSoon(product)) {
    return null;
  }

  return (
    <Fragment>
      <style>{'.theme__product__add-to-cart-bar{display:none!important}'}</style>
      <ComingSoonBar product={product} />
    </Fragment>
  );
};

AvailabilityBar.propTypes = {
  isTablet: PropTypes.bool,
  product: PropTypes.shape(),
};

AvailabilityBar.defaultProps = {
  isTablet: false,
  product: null,
};

export default connect(AvailabilityBar);
