import React from 'react';
import connect from '../../connector';
import ComingSoonGuard from '../../components/ComingSoonGuard';

/**
 * Portal component for `product.ctas.add-to-cart` and `favorites.add-to-cart`.
 * Hides the default add-to-cart (renders nothing) for coming-soon products,
 * and renders the original children for everything else.
 * @param {Object} props Props (incl. children + productId from the portal).
 * @returns {JSX.Element|null} Nothing for coming-soon, otherwise the children.
 */
const HideAddToCart = props => (
  <ComingSoonGuard {...props} renderComingSoon={() => null} />
);

export default connect(HideAddToCart);
