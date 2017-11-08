import year from '../year';
import { local as localDate } from './date';

describe('A year interval should', () => {
  describe('floor the given dates', () => {
    test('to the last year', () => {
      expect(year.floor(localDate(2010, 11, 31, 23, 59, 59))).toEqual(localDate(2010, 0, 1));
      expect(year.floor(localDate(2011, 0, 1, 0, 0, 0))).toEqual(localDate(2011, 0, 1));
      expect(year.floor(localDate(2011, 0, 1, 0, 0, 1))).toEqual(localDate(2011, 0, 1));
    });

    test('without modifying the specified date', () => {
      const d = localDate(2010, 11, 31, 23, 59, 59);

      expect(year.floor(d)).toEqual(localDate(2010, 0, 1));
      expect(d).toEqual(localDate(2010, 11, 31, 23, 59, 59));
    });

    test('while handling years in the first century', () => {
      expect(year.floor(localDate(11, 10, 6, 7))).toEqual(localDate(11, 0, 1));
    });
  });

  describe('\'ceil\' the given dates', () => {
    test('to the next year', () => {
      expect(year.ceil(localDate(2010, 11, 31, 23, 59, 59))).toEqual(localDate(2011, 0, 1));
      expect(year.ceil(localDate(2011, 0, 1, 0, 0, 0))).toEqual(localDate(2011, 0, 1));
      expect(year.ceil(localDate(2011, 0, 1, 0, 0, 1))).toEqual(localDate(2012, 0, 1));
    });
  });

  describe('offset the given dates', () => {
    test('without modifying the passed-in date', () => {
      const d = localDate(2010, 11, 31, 23, 59, 59, 999);

      year.offset(d, +1);

      expect(d).toEqual(localDate(2010, 11, 31, 23, 59, 59, 999));
    });

    test('without rounding the passed-in-date', () => {
      expect(year.offset(localDate(2010, 11, 31, 23, 59, 59, 999), +1))
        .toEqual(localDate(2011, 11, 31, 23, 59, 59, 999));
      expect(year.offset(localDate(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(localDate(2008, 11, 31, 23, 59, 59, 456));
    });

    test('by negative amount', () => {
      expect(year.offset(localDate(2010, 11, 1), -1)).toEqual(localDate(2009, 11, 1));
      expect(year.offset(localDate(2011, 0, 1), -2)).toEqual(localDate(2009, 0, 1));
      expect(year.offset(localDate(2011, 0, 1), -1)).toEqual(localDate(2010, 0, 1));
    });

    test('by positive amount', () => {
      expect(year.offset(localDate(2009, 11, 1), +1)).toEqual(localDate(2010, 11, 1));
      expect(year.offset(localDate(2009, 0, 1), +2)).toEqual(localDate(2011, 0, 1));
      expect(year.offset(localDate(2010, 0, 1), +1)).toEqual(localDate(2011, 0, 1));
    });

    test('by zero offset', () => {
      expect(year.offset(localDate(2010, 11, 31, 23, 59, 59, 999), 0))
        .toEqual(localDate(2010, 11, 31, 23, 59, 59, 999));
      expect(year.offset(localDate(2010, 11, 31, 23, 59, 58, 0), 0))
        .toEqual(localDate(2010, 11, 31, 23, 59, 58, 0));
    });
  });

  describe('generate a range of years', () => {
    test('which contains only years', () => {
      expect(year.getRange(localDate(2010, 0, 1), localDate(2013, 0, 1))).toEqual([
        localDate(2010, 0, 1),
        localDate(2011, 0, 1),
        localDate(2012, 0, 1)
      ]);
    });

    test('with an inclusive lower bound', () => {
      expect(year.getRange(localDate(2010, 0, 1), localDate(2013, 0, 1))[0])
        .toEqual(localDate(2010, 0, 1));
    });

    test('with an exclusive upper bound', () => {
      expect(year.getRange(localDate(2010, 0, 1), localDate(2013, 0, 1))[2])
        .toEqual(localDate(2012, 0, 1));
    });

    test('with skipped years', () => {
      expect(year.getRange(localDate(2009, 0, 1), localDate(2029, 0, 1), 5)).toEqual([
        localDate(2009, 0, 1),
        localDate(2014, 0, 1),
        localDate(2019, 0, 1),
        localDate(2024, 0, 1)
      ]);
    });
  });

  describe('be able to generate years', () => {
    test('at every step, starting with year zero', () => {
      expect(year.every(5).getRange(localDate(2008), localDate(2023))).toEqual([
        localDate(2010),
        localDate(2015),
        localDate(2020)
      ]);
    });
  });
});
