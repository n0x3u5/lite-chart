import year from '../year';
import { local as localDate } from './date';

describe('timeYear.every(n)', () => {
  describe('returns integer multiples of n years', () => {
    test('which can have floored years', () => {
      expect(year.every(10).floor(localDate(2009, 11, 31, 23, 59, 59)))
        .toEqual(localDate(2000, 0, 1));
      expect(year.every(10).floor(localDate(2010, 0, 1, 0, 0, 0)))
        .toEqual(localDate(2010, 0, 1));
      expect(year.every(10).floor(localDate(2010, 0, 1, 0, 0, 1)))
        .toEqual(localDate(2010, 0, 1));
    });

    test('which can have \'ceil\'-ed years', () => {
      expect(year.every(100).ceil(localDate(1999, 11, 31, 23, 59, 59)))
        .toEqual(localDate(2000, 0, 1));
      expect(year.every(100).ceil(localDate(2000, 0, 1, 0, 0, 0)))
        .toEqual(localDate(2000, 0, 1));
      expect(year.every(100).ceil(localDate(2000, 0, 1, 0, 0, 1)))
        .toEqual(localDate(2100, 0, 1));
    });

    test('which can be offset without modifying the date given', () => {
      const d = localDate(2010, 11, 31, 23, 59, 59, 999);

      year.every(5).offset(d, +1);

      expect(d).toEqual(localDate(2010, 11, 31, 23, 59, 59, 999));
    });

    test('which can be offset without rounding the date given', () => {
      expect(year.every(5).offset(localDate(2010, 11, 31, 23, 59, 59, 999), +1))
        .toEqual(localDate(2015, 11, 31, 23, 59, 59, 999));
      expect(year.every(5).offset(localDate(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(localDate(2000, 11, 31, 23, 59, 59, 456));
    });

    test('which generates a range at multiple of n years', () => {
      expect(year.every(10).getRange(localDate(2010, 0, 1), localDate(2031, 0, 1))).toEqual([
        localDate(2010, 0, 1),
        localDate(2020, 0, 1),
        localDate(2030, 0, 1)
      ]);
    });

    test('which cannot generate a count or an array of every step-th multiple', () => {
      const decade = year.every(10);

      expect(decade.getCount(1)).toBe(0);
      expect(decade.every(1)).toBe(null);
    });
  });
});
