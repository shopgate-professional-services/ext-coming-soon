import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getDeviceInformation } from '@shopgate/pwa-common/selectors/client';

/**
 * Maps the current application state to the component props.
 *
 * - **`product`** via `getProduct(state, props)`. The product id comes from the
 *   portal props, which differ per slot:
 *     - PDP add-to-cart slots pass `productId` (route/variant resolution).
 *     - `favorites.add-to-cart` passes `productId` (ctaPortalProps).
 *     - `favorites.product-name.after` passes the id as **`id`** (commonPortalProps),
 *       NOT `productId` — so we normalise `productId = props.productId || props.id`
 *       to resolve the correct *per-item* product on the favourites list (without
 *       it, every item would fall back to the route product). When neither is
 *       present we pass props unchanged so route resolution still works.
 * - **`isTablet`** lets the phone bottom-bar guard stand down on tablet, where
 *   the add-to-cart lives in the right column (see AvailabilityBarTablet).
 * @param {Object} state The current application state.
 * @param {Object} props The current component props (portal props).
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => {
  const productId = props.productId || props.id;
  const productProps = productId
    ? {
      ...props,
      productId,
    }
    : props;

  return {
    product: getProduct(state, productProps),
    isTablet: (getDeviceInformation(state) || {}).type === 'tablet',
  };
};

export default connect(mapStateToProps);
