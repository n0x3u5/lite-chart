import * as date from './date';
import month, { months } from '../month';

describe('Months should be', () => {
  test('an alias for a month interval\'s range', () => {
    expect(months).toEqual(month.getRange);
  });
});

describe('A month interval should', () => {
  describe('be able to floor', () => {
    test('the given time to the last month', () => {
      expect(month.floor(date.local(2010, 11, 31, 23, 59, 59))).toEqual(date.local(2010, 11, 1));
      expect(month.floor(date.local(2011, 0, 1, 0, 0, 0))).toEqual(date.local(2011, 0, 1));
      expect(month.floor(date.local(2011, 0, 1, 0, 0, 1))).toEqual(date.local(2011, 0, 1));

      expect(month.floor(date.local(2010, 11, 31, 23))).toEqual(date.local(2010, 11, 1));
      expect(month.floor(date.local(2011, 0, 1, 0))).toEqual(date.local(2011, 0, 1));
      expect(month.floor(date.local(2011, 0, 1, 1))).toEqual(date.local(2011, 0, 1));
    });

    test('while respecting daylight savings time', () => {
      expect(month.floor(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 2, 1));
      expect(month.floor(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 2, 1));
      expect(month.floor(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 2, 1));
      expect(month.floor(date.utc(2011, 2, 13, 10))).toEqual(date.local(2011, 2, 1));
      expect(month.floor(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 10, 1));
      expect(month.floor(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 10, 1));
      expect(month.floor(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 10, 1));
      expect(month.floor(date.utc(2011, 10, 6, 10))).toEqual(date.local(2011, 10, 1));
    });

    test('while respecting the start of daylight savings time', () => {
      expect(month.floor(date.local(2011, 2, 13, 1))).toEqual(date.local(2011, 2, 1));
    });

    test('while respecting the end of the daylight savings time', () => {
      expect(month.floor(date.local(2011, 10, 6, 1))).toEqual(date.local(2011, 10, 1));
    });

    test('while correctly handling years in the first century', () => {
      expect(month.floor(date.local(11, 10, 6, 7))).toEqual(date.local(11, 10, 1));
    });
  });

  describe('be able to \'ceil\'', () => {
    test('the given time to the next month', () => {
      expect(month.ceil(date.local(2010, 11, 31, 23, 59, 59))).toEqual(date.local(2011, 0, 1));
      expect(month.ceil(date.local(2011, 0, 1, 0, 0, 0))).toEqual(date.local(2011, 0, 1));
      expect(month.ceil(date.local(2011, 0, 1, 0, 0, 1))).toEqual(date.local(2011, 1, 1));

      expect(month.ceil(date.local(2010, 10, 30, 23))).toEqual(date.local(2010, 11, 1));
      expect(month.ceil(date.local(2010, 11, 1, 1))).toEqual(date.local(2011, 0, 1));
      expect(month.ceil(date.local(2011, 1, 1))).toEqual(date.local(2011, 1, 1));
      expect(month.ceil(date.local(2011, 2, 1))).toEqual(date.local(2011, 2, 1));
      expect(month.ceil(date.local(2011, 3, 1))).toEqual(date.local(2011, 3, 1));
    });

    test('while respecting daylight saving time', () => {
      expect(month.ceil(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 3, 1));
      expect(month.ceil(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 3, 1));
      expect(month.ceil(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 3, 1));
      expect(month.ceil(date.utc(2011, 2, 13, 10))).toEqual(date.local(2011, 3, 1));
      expect(month.ceil(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 11, 1));
      expect(month.ceil(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 11, 1));
      expect(month.ceil(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 11, 1));
      expect(month.ceil(date.utc(2011, 10, 6, 10))).toEqual(date.local(2011, 11, 1));
    });

    test('while respecting the start of daylight savings time', () => {
      expect(month.ceil(date.local(2011, 2, 13, 1))).toEqual(date.local(2011, 3, 1));
    });

    test('while respecting the end of the daylight savings time', () => {
      expect(month.ceil(date.local(2011, 10, 6, 1))).toEqual(date.local(2011, 11, 1));
    });

    test('while handling midnight for leap years', () => {
      expect(month.ceil(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 3, 1));
      expect(month.ceil(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 3, 1));
    });
  });

  describe('be able to round', () => {
    test('to the nearest month', () => {
      expect(month.round(date.local(2010, 11, 16, 12))).toEqual(date.local(2011, 0, 1));
      expect(month.round(date.local(2010, 11, 16, 11))).toEqual(date.local(2010, 11, 1));
    });

    test('while respecting daylight saving', () => {
      expect(month.round(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 2, 1));
      expect(month.round(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 2, 1));
      expect(month.round(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 2, 1));
      expect(month.round(date.utc(2011, 2, 13, 20))).toEqual(date.local(2011, 2, 1));
      expect(month.round(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 10, 1));
      expect(month.round(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 10, 1));
      expect(month.round(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 10, 1));
      expect(month.round(date.utc(2011, 10, 6, 20))).toEqual(date.local(2011, 10, 1));
    });

    test('while handling midnight for leap years', () => {
      expect(month.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
      expect(month.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
    });
  });

  describe('be able to offset', () => {
    test('by one month by default', () => {
      expect(month.offset(date.local(2010, 11, 31, 23, 59, 59, 999)))
        .toEqual(date.local(2011, 0, 31, 23, 59, 59, 999));
    });

    test('without changing the passed-in date', () => {
      const d = date.local(2010, 11, 31, 23, 59, 59, 999);

      month.offset(d, 1);

      expect(d).toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
    });

    test('without rounding the passed-in-date', () => {
      expect(month.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 1))
        .toEqual(date.local(2011, 0, 31, 23, 59, 59, 999));
      expect(month.offset(date.local(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(date.local(2010, 9, 31, 23, 59, 59, 456));
    });

    test('by a negative amount', () => {
      expect(month.offset(date.local(2010, 11, 1), -1)).toEqual(date.local(2010, 10, 1));
      expect(month.offset(date.local(2011, 0, 1), -2)).toEqual(date.local(2010, 10, 1));
      expect(month.offset(date.local(2011, 0, 1), -1)).toEqual(date.local(2010, 11, 1));
    });

    test('by a negative amount', () => {
      expect(month.offset(date.local(2010, 10, 1), 1)).toEqual(date.local(2010, 11, 1));
      expect(month.offset(date.local(2010, 10, 1), 2)).toEqual(date.local(2011, 0, 1));
      expect(month.offset(date.local(2010, 11, 1), 1)).toEqual(date.local(2011, 0, 1));
    });

    test('by zero amount', () => {
      expect(month.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
      expect(month.offset(date.local(2010, 11, 31, 23, 59, 58, 0), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 58, 0));
    });
  });

  describe('be able to generate a range of months', () => {
    test('between start (inclusive) and stop (exclusive)', () => {
      expect(month.getRange(date.local(2011, 11, 1), date.local(2012, 5, 1))).toEqual([
        date.local(2011, 11, 1),
        date.local(2012, 0, 1),
        date.local(2012, 1, 1),
        date.local(2012, 2, 1),
        date.local(2012, 3, 1),
        date.local(2012, 4, 1)
      ]);
    });

    test('which includes the start (i.e. the lower bound)', () => {
      expect(month.getRange(date.local(2010, 10, 31), date.local(2011, 2, 1))[0])
        .toEqual(date.local(2010, 11, 1));
    });

    test('which excludes the stop (i.e. the upper bound)', () => {
      expect(month.getRange(date.local(2010, 10, 31), date.local(2011, 2, 1))[2])
        .toEqual(date.local(2011, 1, 1));
    });

    test('which should only contain months', () => {
      expect(month.getRange(date.local(2011, 10, 4, 2), date.local(2012, 4, 10, 13))).toEqual([
        date.local(2011, 11, 1),
        date.local(2012, 0, 1),
        date.local(2012, 1, 1),
        date.local(2012, 2, 1),
        date.local(2012, 3, 1),
        date.local(2012, 4, 1)
      ]);

      expect(month.getRange(date.local(2010, 10, 31), date.local(2011, 2, 1))).toEqual([
        date.local(2010, 11, 1),
        date.local(2011, 0, 1),
        date.local(2011, 1, 1)
      ]);
    });

    test('which coerces start and stop to dates', () => {
      expect(month.getRange(Number(date.local(2011, 10, 4)), Number(date.local(2012, 1, 7))))
        .toEqual([
          date.local(2011, 11, 1),
          date.local(2012, 0, 1),
          date.local(2012, 1, 1)
        ]);
    });

    test('which is empty for invalid dates', () => {
      expect(month.getRange(new Date(NaN), Infinity)).toEqual([]);
    });

    test('which is empty if start >= stop', () => {
      expect(month.getRange(date.local(2011, 11, 10), date.local(2011, 10, 4))).toEqual([]);
      expect(month.getRange(date.local(2011, 10, 1), date.local(2011, 10, 1))).toEqual([]);
    });

    test('which can skip months', () => {
      expect(month.getRange(date.local(2011, 1, 1), date.local(2012, 1, 1), 3)).toEqual([
        date.local(2011, 1, 1),
        date.local(2011, 4, 1),
        date.local(2011, 7, 1),
        date.local(2011, 10, 1)
      ]);
    });

    test('which respects start of daylight savings time', () => {
      expect(month.getRange(date.local(2011, 0, 1), date.local(2011, 4, 1))).toEqual([
        date.local(2011, 0, 1),
        date.local(2011, 1, 1),
        date.local(2011, 2, 1),
        date.local(2011, 3, 1)
      ]);
    });

    test('which respects end of daylight savings time', () => {
      expect(month.getRange(date.local(2011, 9, 1), date.local(2012, 1, 1))).toEqual([
        date.local(2011, 9, 1),
        date.local(2011, 10, 1),
        date.local(2011, 11, 1),
        date.local(2012, 0, 1)
      ]);
    });
  });

  test('be able to count the number of months after start (excl.) and before end (incl.)', () => {
    expect(month.getCount(date.local(2011, 0, 1), date.local(2011, 4, 1))).toBe(4);
    expect(month.getCount(date.local(2011, 0, 1), date.local(2011, 3, 30))).toBe(3);
    expect(month.getCount(date.local(2010, 11, 31), date.local(2011, 3, 30))).toBe(4);
    expect(month.getCount(date.local(2010, 11, 31), date.local(2011, 4, 1))).toBe(5);
    expect(month.getCount(date.local(2009, 11, 31), date.local(2012, 4, 1))).toBe(29);
    expect(month.getCount(date.local(2012, 4, 1), date.local(2009, 11, 31))).toBe(-29);
  });

  test('be able to generate every stepth month, starting with the first month of the year', () => {
    expect(month.every(3).getRange(date.local(2008, 11, 3), date.local(2010, 6, 5)))
      .toEqual([
        date.local(2009, 0, 1),
        date.local(2009, 3, 1),
        date.local(2009, 6, 1),
        date.local(2009, 9, 1),
        date.local(2010, 0, 1),
        date.local(2010, 3, 1),
        date.local(2010, 6, 1)
      ]);
  });
});
