import React from 'react';
import connect from '../../connector';
import ComingSoonGuard from '../../components/ComingSoonGuard';
import FavoritesNotice from '../../components/FavoritesNotice';

/**
 * Portal component for `favorites.product-name.after` (additive slot).
 * Appends the availability notice for coming-soon products; renders nothing
 * otherwise (the slot has no default children).
 * @param {Object} props Props (incl. productId from the portal).
 */
const FavoritesNoticePortal = props => (
  <ComingSoonGuard
    {...props}
    renderComingSoon={product => <FavoritesNotice product={product} />}
  />
);

export default connect(FavoritesNoticePortal);
