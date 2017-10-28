/* eslint-disable no-new-wrappers */
import interpolateValue from '../value';

describe('interpolateValue(a, b) should', () => {
  test('interpolate numbers if b is a number', () => {
    expect(interpolateValue(1, 2)(0.5)).toBe(1.5);
    expect(Number.isNaN(interpolateValue(1, NaN)(0.5))).toBe(true);
  });

  test('interpolate numbers if b is an object that is coercible to a number', () => {
    expect(interpolateValue(1, new Number(2))(0.5)).toBe(1.5);
    expect(interpolateValue(1, new String('2'))(0.5)).toBe(1.5);
  });

  test('should return the constant b if b is null, undefined or a boolean', () => {
    expect(interpolateValue(0, null)(0.5)).toBe(null);
    expect(interpolateValue(0, undefined)(0.5)).toBe(undefined);
    expect(interpolateValue(0, true)(0.5)).toBe(true);
    expect(interpolateValue(0, false)(0.5)).toBe(false);
  });

  test(`should interpolate objects with valueOf as numbers if the result of valueOf is coercible to
    a number`, () => {
      const from = {
              foo: 0,
              valueOf: function valueOf () {
                return String(this.foo);
              }
            },
            to = {
              foo: 2,
              valueOf: function valueOf () {
                return String(this.foo);
              }
            };

      expect(interpolateValue(from, to)(0.5)).toBe(1);
    });

  test(`should interpolate objects with toString as numbers if the result of toString is coercible
    to a number`, () => {
      const from = {
              foo: 0,
              toString: function toString () {
                return String(this.foo);
              }
            },
            to = {
              foo: 2,
              toString: function toString () {
                return String(this.foo);
              }
            };

      expect(interpolateValue(from, to)(0.5)).toBe(1);
    });
});
