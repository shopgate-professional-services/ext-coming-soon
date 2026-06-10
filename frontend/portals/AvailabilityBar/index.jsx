import React from 'react';
import connect from '../../connector';
import { isComingSoon } from '../../helpers/isComingSoon';
import ComingSoonBar from '../../components/ComingSoonBar';

/**
 * Portal component for `product.add-to-cart-bar` (the phone bottom bar).
 * - On tablet the add-to-cart lives in the right column and this bottom bar is
 *   not used (the tablet layout nullifies it). We render nothing here so there
 *   is no duplicate/misplaced bar, regardless of portal registration order.
 * - On phone: the availability bar for coming-soon products, else the original
 *   add-to-cart bar (children).
 * @param {Object} props Props (incl. children, productId, isTablet).
 */
const AvailabilityBar = ({ product, children, isTablet }) => {
  if (isTablet) {
    return null;
  }
  if (isComingSoon(product)) {
    return <ComingSoonBar product={product} />;
  }
  return children;
};

export default connect(AvailabilityBar);
