import { isComingSoon, formatAvailableDate } from './isComingSoon';

const DAY = 24 * 60 * 60 * 1000;
const future = new Date(Date.now() + 30 * DAY).toISOString();
const past = new Date(Date.now() - 30 * DAY).toISOString();

describe('isComingSoon()', () => {
  it('is true when firstAvailableDate is in the future', () => {
    expect(isComingSoon({ firstAvailableDate: future })).toBe(true);
  });

  it('is false when firstAvailableDate is in the past', () => {
    expect(isComingSoon({ firstAvailableDate: past })).toBe(false);
  });

  it('is false when the field is missing', () => {
    expect(isComingSoon({ name: 'x' })).toBe(false);
  });

  it('is false for a null product', () => {
    expect(isComingSoon(null)).toBe(false);
  });

  it('is false for an invalid date', () => {
    expect(isComingSoon({ firstAvailableDate: 'not-a-date' })).toBe(false);
  });

  it('handles a date-only string as local time (no UTC off-by-one)', () => {
    const futureYear = new Date().getFullYear() + 2;
    const pastYear = new Date().getFullYear() - 2;
    expect(isComingSoon({ firstAvailableDate: `${futureYear}-01-01` })).toBe(true);
    expect(isComingSoon({ firstAvailableDate: `${pastYear}-01-01` })).toBe(false);
  });
});

describe('formatAvailableDate()', () => {
  it('formats the date for the given locale', () => {
    const date = new Date('2026-07-02T12:00:00Z').toISOString();
    expect(formatAvailableDate({ firstAvailableDate: date }, 'en-US')).toMatch(/2026/);
  });

  it('returns an empty string when missing or invalid', () => {
    expect(formatAvailableDate({}, 'en-US')).toBe('');
    expect(formatAvailableDate({ firstAvailableDate: 'nope' }, 'en-US')).toBe('');
  });
});
