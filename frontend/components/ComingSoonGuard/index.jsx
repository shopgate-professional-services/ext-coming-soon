import PropTypes from 'prop-types';
import { isComingSoon } from '../../helpers/isComingSoon';

/**
 * Decides what a portal renders for a product.
 * - coming soon  → whatever `renderComingSoon(product)` returns (bar / notice / null)
 * - otherwise    → the portal's original children, unchanged
 *
 * The Portal component passes the theme's default content as `children`, so
 * non-coming-soon products keep their default add-to-cart behaviour.
 * @param {Object} props Component props.
 * @returns {JSX|null}
 */
const ComingSoonGuard = ({ product, children, renderComingSoon }) => {
  if (isComingSoon(product)) {
    return renderComingSoon(product);
  }

  return children;
};

ComingSoonGuard.propTypes = {
  renderComingSoon: PropTypes.func.isRequired,
  children: PropTypes.node,
  product: PropTypes.shape(),
};

ComingSoonGuard.defaultProps = {
  children: null,
  product: null,
};

export default ComingSoonGuard;
