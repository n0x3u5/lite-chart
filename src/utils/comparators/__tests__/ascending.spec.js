import ascending from '../ascending';

describe('ascending(a, b) should', () => {
  test('return a negative value if a < b', () => {
    expect(ascending(0, 1)).toBeLessThan(0);
    expect(ascending('a', 'b')).toBeLessThan(0);
  });

  test('return a positive value if a > b', () => {
    expect(ascending(1, 0)).toBeGreaterThan(0);
    expect(ascending('b', 'a')).toBeGreaterThan(0);
  });

  test('return a zero if a <= b and a >= b', () => {
    expect(ascending(0, 0)).toBe(0);
    expect(ascending('a', 'a')).toBe(0);
    expect(ascending('0', 0)).toBe(0);
    expect(ascending(0, '0')).toBe(0);
  });

  test('return NaN if a and b are not comparable', () => {
    expect(Number.isNaN(ascending(0, undefined))).toBeTruthy();
    expect(Number.isNaN(ascending(undefined, 0))).toBeTruthy();
    expect(Number.isNaN(ascending(undefined, undefined))).toBeTruthy();
    expect(Number.isNaN(ascending(0, NaN))).toBeTruthy();
    expect(Number.isNaN(ascending(NaN, 0))).toBeTruthy();
    expect(Number.isNaN(ascending(NaN, NaN))).toBeTruthy();
  });
});
