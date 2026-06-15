import React from 'react';
import connect from '../../connector';
import { isComingSoon } from '../../helpers/isComingSoon';
import ComingSoonBarTablet from '../../components/ComingSoonBarTablet';

/**
 * Portal component for `product.tablet.right-column.add-to-cart` — the tablet
 * add-to-cart slot (provided by the tablet layout / ext-tablet-adjustments,
 * which also passes productId/variantId into the portal).
 * Shows the greyed availability bar for coming-soon products; otherwise renders
 * the original tablet add-to-cart button (children).
 * @param {Object} props Props (incl. children + productId from the portal).
 * @returns {JSX.Element} The availability bar or the original children.
 */
const AvailabilityBarTablet = ({ product, children }) => {
  if (isComingSoon(product)) {
    return <ComingSoonBarTablet product={product} />;
  }
  return children;
};

export default connect(AvailabilityBarTablet);
