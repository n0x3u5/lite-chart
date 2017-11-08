import day, { days } from '../day';
import year from '../year';
import * as date from './date';

describe('Day intervals should', () => {
  test('be an alias for a day interval\'s range', () => {
    expect(days).toEqual(day.getRange);
  });
});

describe('A day interval should', () => {
  describe('be able to floor a given time', () => {
    test('to the correct day', () => {
      expect(day.floor(date.local(2010, 11, 31, 23))).toEqual(date.local(2010, 11, 31));
      expect(day.floor(date.local(2011, 0, 1, 0))).toEqual(date.local(2011, 0, 1));
      expect(day.floor(date.local(2011, 0, 1, 1))).toEqual(date.local(2011, 0, 1));
    });

    test('while respect daylight savings', () => {
      expect(day.floor(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 2, 13));
      expect(day.floor(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 2, 13));
      expect(day.floor(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 2, 13));
      expect(day.floor(date.utc(2011, 2, 13, 10))).toEqual(date.local(2011, 2, 13));
      expect(day.floor(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 10, 6));
      expect(day.floor(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 10, 6));
      expect(day.floor(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 10, 6));
      expect(day.floor(date.utc(2011, 10, 6, 10))).toEqual(date.local(2011, 10, 6));
    });

    test('for years in the first century', () => {
      expect(day.floor(date.local(11, 10, 6, 7))).toEqual(date.local(11, 10, 6));
    });
  });

  describe('be able to round a given time', () => {
    test('to the correct day', () => {
      expect(day.round(date.local(2010, 11, 30, 13))).toEqual(date.local(2010, 11, 31));
      expect(day.round(date.local(2010, 11, 30, 11))).toEqual(date.local(2010, 11, 30));
    });
    test('while respecting daylight savings', () => {
      expect(day.round(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 2, 14));
      expect(day.round(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 2, 14));
      expect(day.round(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 2, 14));
      expect(day.round(date.utc(2011, 2, 13, 20))).toEqual(date.local(2011, 2, 14));
      expect(day.round(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 10, 7));
      expect(day.round(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 10, 7));
      expect(day.round(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 10, 7));
      expect(day.round(date.utc(2011, 10, 6, 20))).toEqual(date.local(2011, 10, 7));
    });
    test('to midnight in leap years', () => {
      expect(day.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
      expect(day.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
    });
  });

  describe('be abe to raise a given time', () => {
    test('to the correct day', () => {
      expect(day.ceil(date.local(2010, 11, 30, 23))).toEqual(date.local(2010, 11, 31));
      expect(day.ceil(date.local(2010, 11, 31, 0))).toEqual(date.local(2010, 11, 31));
      expect(day.ceil(date.local(2010, 11, 31, 1))).toEqual(date.local(2011, 0, 1));
    });

    test('while respecting the start of daylight savings', () => {
      expect(day.ceil(date.utc(2011, 2, 13, 7))).toEqual(date.local(2011, 2, 14));
      expect(day.ceil(date.utc(2011, 2, 13, 8))).toEqual(date.local(2011, 2, 14));
      expect(day.ceil(date.utc(2011, 2, 13, 9))).toEqual(date.local(2011, 2, 14));
      expect(day.ceil(date.utc(2011, 2, 13, 10))).toEqual(date.local(2011, 2, 14));
    });

    test('while respecting the end of daylight savings', () => {
      expect(day.ceil(date.utc(2011, 10, 6, 7))).toEqual(date.local(2011, 10, 7));
      expect(day.ceil(date.utc(2011, 10, 6, 8))).toEqual(date.local(2011, 10, 7));
      expect(day.ceil(date.utc(2011, 10, 6, 9))).toEqual(date.local(2011, 10, 7));
      expect(day.ceil(date.utc(2011, 10, 6, 10))).toEqual(date.local(2011, 10, 7));
    });

    test('to midnight in leap years', () => {
      expect(day.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
      expect(day.round(date.utc(2012, 2, 1, 0))).toEqual(date.local(2012, 2, 1));
    });
  });

  describe('be able to offset a time', () => {
    test('by a step of one day if no offset is specified', () => {
      expect(day.offset(date.local(2010, 11, 31, 23, 59, 59, 999)))
        .toEqual(date.local(2011, 0, 1, 23, 59, 59, 999));
    });

    test('without modifying the date passed into it', () => {
      const d = new Date(2010, 11, 31, 23, 59, 59, 999);

      day.offset(d, 1);

      expect(d).toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
    });

    test('without rounding the date passed into it', () => {
      expect(day.offset(date.local(2010, 11, 31, 23, 59, 59, 999), +1))
        .toEqual(date.local(2011, 0, 1, 23, 59, 59, 999));
      expect(day.offset(date.local(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(date.local(2010, 11, 29, 23, 59, 59, 456));
    });

    test('when the given step is negative', () => {
      expect(day.offset(date.local(2010, 11, 31), -1)).toEqual(date.local(2010, 11, 30));
      expect(day.offset(date.local(2011, 0, 1), -2)).toEqual(date.local(2010, 11, 30));
      expect(day.offset(date.local(2011, 0, 1), -1)).toEqual(date.local(2010, 11, 31));
    });

    test('when the given step is positive', () => {
      expect(day.offset(date.local(2010, 11, 31), +1)).toEqual(date.local(2011, 0, 1));
      expect(day.offset(date.local(2010, 11, 30), +2)).toEqual(date.local(2011, 0, 1));
      expect(day.offset(date.local(2010, 11, 30), +1)).toEqual(date.local(2010, 11, 31));
    });

    test('when the given step is zero', () => {
      expect(day.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
      expect(day.offset(date.local(2010, 11, 31, 23, 59, 58, 0), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 58, 0));
    });
  });

  describe('be able to provide a range of days', () => {
    test('between a starting day (exclusive) and an ending day (exclusive)', () => {
      expect(day.getRange(date.local(2011, 10, 4), date.local(2011, 10, 10))).toEqual([
        date.local(2011, 10, 4),
        date.local(2011, 10, 5),
        date.local(2011, 10, 6),
        date.local(2011, 10, 7),
        date.local(2011, 10, 8),
        date.local(2011, 10, 9)
      ]);
    });

    test('by coercing the start time and end time to days', () => {
      expect(day.getRange(Number(date.local(2011, 10, 4)), Number(date.local(2011, 10, 7))))
        .toEqual([
          date.local(2011, 10, 4),
          date.local(2011, 10, 5),
          date.local(2011, 10, 6)
        ]);
    });

    describe('which is empty if', () => {
      test('the input dates are invalid', () => {
        expect(day.getRange(new Date(NaN), Infinity)).toEqual([]);
      });

      test('the start date >= the stop date', () => {
        expect(day.getRange(date.local(2011, 10, 10), date.local(2011, 10, 4))).toEqual([]);
        expect(day.getRange(date.local(2011, 10, 10), date.local(2011, 10, 10))).toEqual([]);
      });

      test('if the given step is zero, negative or NaN', () => {
        expect(day.getRange(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 0), 0)).toEqual([]);
        expect(day.getRange(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 0), -1)).toEqual([]);
        expect(day.getRange(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 0), 0.5)).toEqual([]);
        expect(day.getRange(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 0), NaN)).toEqual([]);
      });
    });

    test('every step day onwards', () => {
      expect(day.getRange(date.local(2011, 10, 4, 2), date.local(2011, 10, 14, 13), 3)).toEqual([
        date.local(2011, 10, 5),
        date.local(2011, 10, 8),
        date.local(2011, 10, 11),
        date.local(2011, 10, 14)
      ]);
    });
  });

  describe('count the number of days between two dates', () => {
    test('while excluding the start date and the including the end date', () => {
      expect(day.getCount(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 0))).toBe(128);
      expect(day.getCount(date.local(2011, 0, 1, 1), date.local(2011, 4, 9, 0))).toBe(128);
      expect(day.getCount(date.local(2010, 11, 31, 23), date.local(2011, 4, 9, 0))).toBe(129);
      expect(day.getCount(date.local(2011, 0, 1, 0), date.local(2011, 4, 8, 23))).toBe(127);
      expect(day.getCount(date.local(2011, 0, 1, 0), date.local(2011, 4, 9, 1))).toBe(128);
    });

    test('while respecting daylight saving time', () => {
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 2, 13, 1))).toBe(71);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 2, 13, 3))).toBe(71);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 2, 13, 4))).toBe(71);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 10, 6, 0))).toBe(309);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 10, 6, 1))).toBe(309);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 10, 6, 2))).toBe(309);
    });

    test('without any floating point rounding errors', () => {
      const d = new Date(2011, 4, 9);
      expect(day.count(year.floor(d), d)).toBe(128);
    });

    test('which will be 364 or 365 for a full year', () => {
      expect(day.getCount(date.local(1999, 0, 1), date.local(1999, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2000, 0, 1), date.local(2000, 11, 31))).toBe(365); // leap year
      expect(day.getCount(date.local(2001, 0, 1), date.local(2001, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2002, 0, 1), date.local(2002, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2003, 0, 1), date.local(2003, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2004, 0, 1), date.local(2004, 11, 31))).toBe(365); // leap year
      expect(day.getCount(date.local(2005, 0, 1), date.local(2005, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2006, 0, 1), date.local(2006, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2007, 0, 1), date.local(2007, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2008, 0, 1), date.local(2008, 11, 31))).toBe(365); // leap year
      expect(day.getCount(date.local(2009, 0, 1), date.local(2009, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2010, 0, 1), date.local(2010, 11, 31))).toBe(364);
      expect(day.getCount(date.local(2011, 0, 1), date.local(2011, 11, 31))).toBe(364);
    });
  });

  test('be able to return every stepth day, starting with the first day of the month', () => {
    expect(day.every(3).getRange(date.local(2008, 11, 30, 0, 12), date.local(2009, 0, 5, 23, 48)))
      .toEqual([
        date.local(2008, 11, 31),
        date.local(2009, 0, 1),
        date.local(2009, 0, 4)
      ]);
    expect(day.every(5).getRange(date.local(2008, 11, 30, 0, 12), date.local(2009, 0, 6, 23, 48)))
      .toEqual([
        date.local(2008, 11, 31),
        date.local(2009, 0, 1),
        date.local(2009, 0, 6)
      ]);
    expect(day.every(7).getRange(date.local(2008, 11, 30, 0, 12), date.local(2009, 0, 8, 23, 48)))
      .toEqual([
        date.local(2009, 0, 1),
        date.local(2009, 0, 8)
      ]);
  });
});
