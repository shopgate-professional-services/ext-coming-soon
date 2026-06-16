import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { formatAvailableDate } from '../../helpers/isComingSoon';

const { colors } = themeConfig;

const styles = {
  notice: {
    marginTop: 4,
    fontSize: 13,
    color: colors.cta,
    fontWeight: 600,
  },
};

/**
 * Small availability notice appended after the product name on the
 * favourites list (additive slot — rendered only for coming-soon items).
 * @param {Object} props Component props.
 * @param {Object} props.product Product or selected-variant data.
 * @returns {JSX.Element} The availability notice.
 */
const FavoritesNotice = ({ product }) => (
  <div
    className="coming-soon-favorites-notice"
    style={styles.notice}
    data-test-id="comingSoonFavNotice"
  >
    <I18n.Text
      string="comingSoon.available_on"
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
