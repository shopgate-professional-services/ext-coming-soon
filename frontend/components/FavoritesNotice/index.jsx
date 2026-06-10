import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { formatAvailableDate } from '../../helpers/isComingSoon';

const styles = {
  notice: {
    marginTop: 4,
    fontSize: 13,
    color: '#664d03',
    fontWeight: 600,
  },
};

/**
 * Small availability notice appended after the product name on the
 * favourites list (additive slot — rendered only for coming-soon items).
 * @param {Object} props Component props.
 * @param {Object} props.product Product or selected-variant data.
 */
const FavoritesNotice = ({ product }) => (
  <div
    className="coming-soon-favorites-notice"
    style={styles.notice}
    data-test-id="comingSoonFavNotice"
  >
    <I18n.Text
      string="ext-coming-soon.available_on"
      params={{ date: formatAvailableDate(product) }}
    />
  </div>
);

FavoritesNotice.propTypes = {
  product: PropTypes.shape(),
};

FavoritesNotice.defaultProps = {
  product: null,
};

export default FavoritesNotice;
