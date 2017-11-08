import week, { sunday } from '../week';
import { local as localDate } from './date';

describe('A week interval should', () => {
  describe('when floored', () => {
    test('return Sundays', () => {
      expect(week.floor(localDate(2010, 11, 31, 23, 59, 59))).toEqual(localDate(2010, 11, 26));
      expect(week.floor(localDate(2011, 0, 1, 0, 0, 0))).toEqual(localDate(2010, 11, 26));
      expect(week.floor(localDate(2011, 0, 1, 0, 0, 1))).toEqual(localDate(2010, 11, 26));
      expect(week.floor(localDate(2011, 0, 1, 23, 59, 59))).toEqual(localDate(2010, 11, 26));
      expect(week.floor(localDate(2011, 0, 2, 0, 0, 0))).toEqual(localDate(2011, 0, 2));
      expect(week.floor(localDate(2011, 0, 2, 0, 0, 1))).toEqual(localDate(2011, 0, 2));
    });

    test('respect the start of daylight saving time', () => {
      expect(week.floor(localDate(2011, 2, 13, 1))).toEqual(localDate(2011, 2, 13));
    });

    test('respect the end of daylight saving time', () => {
      expect(week.floor(localDate(2011, 10, 6, 1))).toEqual(localDate(2011, 10, 6));
    });

    test('correctly handles years in the first century', () => {
      expect(week.floor(localDate(11, 10, 6, 7))).toEqual(localDate(11, 10, 6));
    });
  });

  describe('when \'ceil\'-ed', () => {
    test('return sundays', () => {
      expect(week.ceil(localDate(2010, 11, 31, 23, 59, 59))).toEqual(localDate(2011, 0, 2));
      expect(week.ceil(localDate(2011, 0, 1, 0, 0, 0))).toEqual(localDate(2011, 0, 2));
      expect(week.ceil(localDate(2011, 0, 1, 0, 0, 1))).toEqual(localDate(2011, 0, 2));
      expect(week.ceil(localDate(2011, 0, 1, 23, 59, 59))).toEqual(localDate(2011, 0, 2));
      expect(week.ceil(localDate(2011, 0, 2, 0, 0, 0))).toEqual(localDate(2011, 0, 2));
      expect(week.ceil(localDate(2011, 0, 2, 0, 0, 1))).toEqual(localDate(2011, 0, 9));
    });

    test('respect the start of daylight savings time', () => {
      expect(week.ceil(localDate(2011, 2, 13, 1))).toEqual(localDate(2011, 2, 20));
    });

    test('respect the end of the daylight savings time', () => {
      expect(week.ceil(localDate(2011, 10, 6, 1))).toEqual(localDate(2011, 10, 13));
    });
  });

  describe('be able to offset a given time by the specified number of weeks', () => {
    test('without modifying the passed-in date', () => {
      const d = localDate(2010, 11, 31, 23, 59, 59, 999);

      week.offset(d, +1);

      expect(d).toEqual(localDate(2010, 11, 31, 23, 59, 59, 999));
    });

    test('without rounding the passed-in-date', () => {
      expect(week.offset(localDate(2010, 11, 31, 23, 59, 59, 999), 1))
        .toEqual(localDate(2011, 0, 7, 23, 59, 59, 999));
      expect(week.offset(localDate(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(localDate(2010, 11, 17, 23, 59, 59, 456));
    });

    test('when the offset is negative', () => {
      expect(week.offset(localDate(2010, 11, 1), -1)).toEqual(localDate(2010, 10, 24));
      expect(week.offset(localDate(2011, 0, 1), -2)).toEqual(localDate(2010, 11, 18));
      expect(week.offset(localDate(2011, 0, 1), -1)).toEqual(localDate(2010, 11, 25));
    });

    test('when the offset is positive', () => {
      expect(week.offset(localDate(2010, 10, 24), 1)).toEqual(localDate(2010, 11, 1));
      expect(week.offset(localDate(2010, 11, 18), 2)).toEqual(localDate(2011, 0, 1));
      expect(week.offset(localDate(2010, 11, 25), 1)).toEqual(localDate(2011, 0, 1));
    });

    test('when the offset is zero', () => {
      expect(week.offset(localDate(2010, 11, 31, 23, 59, 59, 999), 0))
        .toEqual(localDate(2010, 11, 31, 23, 59, 59, 999));
      expect(week.offset(localDate(2010, 11, 31, 23, 59, 58, 0), 0))
        .toEqual(localDate(2010, 11, 31, 23, 59, 58, 0));
    });
  });

  describe('when generating a range of weeks', () => {
    test('return sundays', () => {
      expect(week.getRange(localDate(2010, 11, 21), localDate(2011, 0, 12))).toEqual([
        localDate(2010, 11, 26),
        localDate(2011, 0, 2),
        localDate(2011, 0, 9)
      ]);
    });

    test('have an inclusive lower bound', () => {
      expect(week.getRange(localDate(2010, 11, 21), localDate(2011, 0, 12))[0])
        .toEqual(localDate(2010, 11, 26));
    });

    test('have an exclusive upper bound', () => {
      expect(week.getRange(localDate(2010, 11, 21), localDate(2011, 0, 12))[2])
        .toEqual(localDate(2011, 0, 9));
    });

    test('be able to skip weeks', () => {
      expect(week.getRange(localDate(2011, 0, 1), localDate(2011, 3, 1), 4)).toEqual([
        localDate(2011, 0, 2),
        localDate(2011, 0, 30),
        localDate(2011, 1, 27),
        localDate(2011, 2, 27)
      ]);
    });

    test('respect the start of daylight savings time', () => {
      expect(week.getRange(localDate(2011, 2, 1), localDate(2011, 2, 28))).toEqual([
        localDate(2011, 2, 6),
        localDate(2011, 2, 13),
        localDate(2011, 2, 20),
        localDate(2011, 2, 27)
      ]);
    });

    test('respect the end of daylight savings time', () => {
      expect(week.getRange(localDate(2011, 10, 1), localDate(2011, 10, 30))).toEqual([
        localDate(2011, 10, 6),
        localDate(2011, 10, 13),
        localDate(2011, 10, 20),
        localDate(2011, 10, 27)
      ]);
    });
  });

  test('a week interval is the same as a Sunday interval', () => {
    expect(week).toEqual(sunday);
  });

  test('return every stepth week, starting with the first Sunday of the month', () => {
    expect(week.every(2).getRange(localDate(2008, 11, 3), localDate(2009, 1, 5))).toEqual([
      localDate(2008, 11, 7),
      localDate(2008, 11, 21),
      localDate(2009, 0, 4),
      localDate(2009, 0, 18),
      localDate(2009, 1, 1)
    ]);
  });
});
