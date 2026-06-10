import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the current application state to the component props.
 * `getProduct(state, props)` resolves the product for the current route and
 * respects the selected variant (it reads the resolved product id, which is
 * the variant id when a variant is selected).
 * @param {Object} state The current application state.
 * @param {Object} props The current component props (incl. productId from the portal).
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProduct(state, props),
});

export default connect(mapStateToProps);
