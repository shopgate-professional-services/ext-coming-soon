import React from 'react';
import connect from '../../connector';
import ComingSoonGuard from '../../components/ComingSoonGuard';
import ComingSoonBar from '../../components/ComingSoonBar';

/**
 * Portal component for `product.add-to-cart-bar` (the PDP sticky bar).
 * Shows the "available on <date>" bar for coming-soon products, and the
 * original children (default add-to-cart bar) for everything else.
 * @param {Object} props Props (incl. children + productId from the portal).
 */
const AvailabilityBar = props => (
  <ComingSoonGuard
    {...props}
    renderComingSoon={product => <ComingSoonBar product={product} />}
  />
);

export default connect(AvailabilityBar);
