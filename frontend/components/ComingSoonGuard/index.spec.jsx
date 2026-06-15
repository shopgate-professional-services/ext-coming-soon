import React from 'react';
import { shallow } from 'enzyme';
import ComingSoonGuard from './index';

const DAY = 24 * 60 * 60 * 1000;
const future = new Date(Date.now() + 30 * DAY).toISOString();
const past = new Date(Date.now() - 30 * DAY).toISOString();

/**
 * Stub coming-soon renderer for the tests.
 * @returns {JSX.Element} A marker node.
 */
const renderComingSoon = () => <div className="coming-soon">soon</div>;

describe('<ComingSoonGuard />', () => {
  it('renders the coming-soon output (hiding children) for a future product', () => {
    const wrapper = shallow(
      <ComingSoonGuard product={{ firstAvailableDate: future }} renderComingSoon={renderComingSoon}>
        <button type="button">add to cart</button>
      </ComingSoonGuard>
    );
    expect(wrapper.find('.coming-soon')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(0);
  });

  it('renders the original children for a non-coming-soon product', () => {
    const wrapper = shallow(
      <ComingSoonGuard product={{ firstAvailableDate: past }} renderComingSoon={renderComingSoon}>
        <button type="button">add to cart</button>
      </ComingSoonGuard>
    );
    expect(wrapper.find('button')).toHaveLength(1);
    expect(wrapper.find('.coming-soon')).toHaveLength(0);
  });

  it('renders children when there is no product', () => {
    const wrapper = shallow(
      <ComingSoonGuard product={null} renderComingSoon={renderComingSoon}>
        <button type="button">add to cart</button>
      </ComingSoonGuard>
    );
    expect(wrapper.find('button')).toHaveLength(1);
  });
});
