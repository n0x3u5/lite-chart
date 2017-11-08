import second from '../second';
import * as date from './date';

describe('A second interval should', () => {
  test('floor to the last second', () => {
    expect(second.floor(date.local(2010, 11, 31, 23, 59, 59, 999)))
      .toEqual(date.local(2010, 11, 31, 23, 59, 59));
    expect(second.floor(date.local(2011, 0, 1, 0, 0, 0, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    expect(second.floor(date.local(2011, 0, 1, 0, 0, 0, 1)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
  });

  test('round to the nearest second', () => {
    expect(second.round(date.local(2010, 11, 31, 23, 59, 59, 999)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    expect(second.round(date.local(2011, 0, 1, 0, 0, 0, 499)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    expect(second.round(date.local(2011, 0, 1, 0, 0, 0, 500)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 1));
  });

  test('raise to the next second', () => {
    expect(second.ceil(date.local(2010, 11, 31, 23, 59, 59, 999)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    expect(second.ceil(date.local(2011, 0, 1, 0, 0, 0, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    expect(second.ceil(date.local(2011, 0, 1, 0, 0, 0, 1)))
      .toEqual(date.local(2011, 0, 1, 0, 0, 1));
  });

  describe('offset by the given amount', () => {
    test('without modifying the passed-in date', () => {
      const d = date.local(2010, 11, 31, 23, 59, 59, 999);

      second.offset(d, +1);

      expect(d).toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
    });

    test('without rounding the passed-in-date', () => {
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 1))
        .toEqual(date.local(2011, 0, 1, 0, 0, 0, 999));
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 59, 456), -2))
        .toEqual(date.local(2010, 11, 31, 23, 59, 57, 456));
    });

    test('by a negative amount', () => {
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 59), -1))
        .toEqual(date.local(2010, 11, 31, 23, 59, 58));
      expect(second.offset(date.local(2011, 0, 1, 0, 0, 0), -2))
        .toEqual(date.local(2010, 11, 31, 23, 59, 58));
      expect(second.offset(date.local(2011, 0, 1, 0, 0, 0), -1))
        .toEqual(date.local(2010, 11, 31, 23, 59, 59));
    });

    test('by a positive amount', () => {
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 58), 1))
        .toEqual(date.local(2010, 11, 31, 23, 59, 59));
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 58), 2))
        .toEqual(date.local(2011, 0, 1, 0, 0, 0));
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 59), 1))
        .toEqual(date.local(2011, 0, 1, 0, 0, 0));
    });

    test('by zero amount', () => {
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
      expect(second.offset(date.local(2010, 11, 31, 23, 59, 58, 0), 0))
        .toEqual(date.local(2010, 11, 31, 23, 59, 58, 0));
    });
  });

  describe('generate a range of seconds', () => {
    test('which contains only seconds', () => {
      expect(second.getRange(date.local(2010, 11, 31, 23, 59, 59), date.local(2011, 0, 1, 0, 0, 2)))
        .toEqual([
          date.local(2010, 11, 31, 23, 59, 59),
          date.local(2011, 0, 1, 0, 0, 0),
          date.local(2011, 0, 1, 0, 0, 1)
        ]);
    });

    test('which includes the lower bound (i.e. the start)', () => {
      expect(second
        .getRange(date.local(2010, 11, 31, 23, 59, 59), date.local(2011, 0, 1, 0, 0, 2))[0])
        .toEqual(date.local(2010, 11, 31, 23, 59, 59));
    });

    test('which excludes the upper bound (i.e. the stop)', () => {
      expect(second
        .getRange(date.local(2010, 11, 31, 23, 59, 59), date.local(2011, 0, 1, 0, 0, 2))[2])
        .toEqual(date.local(2011, 0, 1, 0, 0, 1));
    });

    test('which can skip seconds', () => {
      expect(second
        .getRange(date.local(2011, 1, 1, 12, 0, 7), date.local(2011, 1, 1, 12, 1, 7), 15))
        .toEqual([
          date.local(2011, 1, 1, 12, 0, 7),
          date.local(2011, 1, 1, 12, 0, 22),
          date.local(2011, 1, 1, 12, 0, 37),
          date.local(2011, 1, 1, 12, 0, 52)
        ]);
    });

    test('which respects the start of daylight savings time', () => {
      expect(second.getRange(date.utc(2011, 2, 13, 9, 59, 59), date.utc(2011, 2, 13, 10, 0, 2)))
        .toEqual([
          date.utc(2011, 2, 13, 9, 59, 59),
          date.utc(2011, 2, 13, 10, 0, 0),
          date.utc(2011, 2, 13, 10, 0, 1)
        ]);
    });

    test('which respects the end of daylight savings time', () => {
      expect(second.getRange(date.utc(2011, 10, 6, 8, 59, 59), date.utc(2011, 10, 6, 9, 0, 2)))
        .toEqual([
          date.utc(2011, 10, 6, 8, 59, 59),
          date.utc(2011, 10, 6, 9, 0, 0),
          date.utc(2011, 10, 6, 9, 0, 1)
        ]);
    });

    test('which can cross over the daylight savings boundary', () => {
      expect(second
        .getRange(new Date(1478422800000 - (2 * 1e3)), new Date(1478422800000 + (2 * 1e3))))
        .toEqual([
          new Date(1478422798000), // Sun Nov 06 2016 14:29:58 GMT+0530 (IST)
          new Date(1478422799000), // Sun Nov 06 2016 14:29:59 GMT+0530 (IST)
          new Date(1478422800000), // Sun Nov 06 2016 14:30:00 GMT+0530 (IST)
          new Date(1478422801000) // Sun Nov 06 2016 14:30:01 GMT+0530 (IST)
        ]);
    });
  });

  test('return every stepth second, starting with the first second of the minute', () => {
    expect(second.every(15)
      .getRange(date.local(2008, 11, 30, 12, 36, 47), date.local(2008, 11, 30, 12, 37, 57)))
      .toEqual([
        date.local(2008, 11, 30, 12, 37, 0),
        date.local(2008, 11, 30, 12, 37, 15),
        date.local(2008, 11, 30, 12, 37, 30),
        date.local(2008, 11, 30, 12, 37, 45)
      ]);
    expect(second.every(30)
      .getRange(date.local(2008, 11, 30, 12, 36, 47), date.local(2008, 11, 30, 12, 37, 57)))
      .toEqual([
        date.local(2008, 11, 30, 12, 37, 0),
        date.local(2008, 11, 30, 12, 37, 30)
      ]);
  });
});
