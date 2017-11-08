import hour from '../hour';
import * as date from './date';

describe('An hour interval should', () => {
  test('return hours after flooring', () => {
    expect(hour.floor(date.local(2010, 11, 31, 23, 59))).toEqual(date.local(2010, 11, 31, 23));
    expect(hour.floor(date.local(2011, 0, 1, 0, 0))).toEqual(date.local(2011, 0, 1, 0));
    expect(hour.floor(date.local(2011, 0, 1, 0, 1))).toEqual(date.local(2011, 0, 1, 0));
  });

  test('respects the start of daylight saving time while flooring', () => {
    expect(hour.floor(date.utc(2011, 2, 13, 8, 59))).toEqual(date.utc(2011, 2, 13, 8, 30));
    expect(hour.floor(date.utc(2011, 2, 13, 9, 0))).toEqual(date.utc(2011, 2, 13, 8, 30));
    expect(hour.floor(date.utc(2011, 2, 13, 9, 1))).toEqual(date.utc(2011, 2, 13, 8, 30));
    expect(hour.floor(date.utc(2011, 2, 13, 9, 59))).toEqual(date.utc(2011, 2, 13, 9, 30));
    expect(hour.floor(date.utc(2011, 2, 13, 10, 0))).toEqual(date.utc(2011, 2, 13, 9, 30));
    expect(hour.floor(date.utc(2011, 2, 13, 10, 1))).toEqual(date.utc(2011, 2, 13, 9, 30));
  });

  test('respects the end of daylight saving time while flooring', () => {
    expect(hour.floor(date.utc(2011, 10, 6, 7, 59))).toEqual(date.utc(2011, 10, 6, 7, 30));
    expect(hour.floor(date.utc(2011, 10, 6, 8, 0))).toEqual(date.utc(2011, 10, 6, 7, 30));
    expect(hour.floor(date.utc(2011, 10, 6, 8, 1))).toEqual(date.utc(2011, 10, 6, 7, 30));
    expect(hour.floor(date.utc(2011, 10, 6, 8, 59))).toEqual(date.utc(2011, 10, 6, 8, 30));
    expect(hour.floor(date.utc(2011, 10, 6, 9, 0))).toEqual(date.utc(2011, 10, 6, 8, 30));
    expect(hour.floor(date.utc(2011, 10, 6, 9, 1))).toEqual(date.utc(2011, 10, 6, 8, 30));
  });

  test('returns hours after \'ceil\'-ing', () => {
    expect(hour.ceil(date.local(2010, 11, 31, 23, 59))).toEqual(date.local(2011, 0, 1, 0));
    expect(hour.ceil(date.local(2011, 0, 1, 0, 0))).toEqual(date.local(2011, 0, 1, 0));
    expect(hour.ceil(date.local(2011, 0, 1, 0, 1))).toEqual(date.local(2011, 0, 1, 1));
  });

  test('respect the start of daylight savings time when \'ceil\'-ing', () => {
    expect(hour.ceil(date.utc(2011, 2, 13, 8, 59))).toEqual(date.utc(2011, 2, 13, 9, 30));
    expect(hour.ceil(date.utc(2011, 2, 13, 9, 0))).toEqual(date.utc(2011, 2, 13, 9, 30));
    expect(hour.ceil(date.utc(2011, 2, 13, 9, 1))).toEqual(date.utc(2011, 2, 13, 9, 30));
    expect(hour.ceil(date.utc(2011, 2, 13, 9, 59))).toEqual(date.utc(2011, 2, 13, 10, 30));
    expect(hour.ceil(date.utc(2011, 2, 13, 10, 0))).toEqual(date.utc(2011, 2, 13, 10, 30));
    expect(hour.ceil(date.utc(2011, 2, 13, 10, 1))).toEqual(date.utc(2011, 2, 13, 10, 30));
  });

  test('respect the end of daylight savings time when \'ceil\'-ing', () => {
    expect(hour.ceil(date.utc(2011, 10, 6, 7, 59))).toEqual(date.utc(2011, 10, 6, 8, 30));
    expect(hour.ceil(date.utc(2011, 10, 6, 8, 0))).toEqual(date.utc(2011, 10, 6, 8, 30));
    expect(hour.ceil(date.utc(2011, 10, 6, 8, 1))).toEqual(date.utc(2011, 10, 6, 8, 30));
    expect(hour.ceil(date.utc(2011, 10, 6, 8, 59))).toEqual(date.utc(2011, 10, 6, 9, 30));
    expect(hour.ceil(date.utc(2011, 10, 6, 9, 0))).toEqual(date.utc(2011, 10, 6, 9, 30));
    expect(hour.ceil(date.utc(2011, 10, 6, 9, 1))).toEqual(date.utc(2011, 10, 6, 9, 30));
  });

  test('not modify the passed-in date when offsetting', () => {
    const d = date.local(2010, 11, 31, 23, 59, 59, 999);

    hour.offset(d, +1);

    expect(d).toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
  });

  test('not round the passed-in-date when offsetting', () => {
    expect(hour.offset(date.local(2010, 11, 31, 23, 59, 59, 999), +1))
      .toEqual(date.local(2011, 0, 1, 0, 59, 59, 999));
    expect(hour.offset(date.local(2010, 11, 31, 23, 59, 59, 456), -2))
      .toEqual(date.local(2010, 11, 31, 21, 59, 59, 456));
  });

  test('allow negative offsets', () => {
    expect(hour.offset(date.local(2010, 11, 31, 12), -1)).toEqual(date.local(2010, 11, 31, 11));
    expect(hour.offset(date.local(2011, 0, 1, 1), -2)).toEqual(date.local(2010, 11, 31, 23));
    expect(hour.offset(date.local(2011, 0, 1, 0), -1)).toEqual(date.local(2010, 11, 31, 23));
  });

  test('allow positive offsets', () => {
    expect(hour.offset(date.local(2010, 11, 31, 11), +1)).toEqual(date.local(2010, 11, 31, 12));
    expect(hour.offset(date.local(2010, 11, 31, 23), +2)).toEqual(date.local(2011, 0, 1, 1));
    expect(hour.offset(date.local(2010, 11, 31, 23), +1)).toEqual(date.local(2011, 0, 1, 0));
  });

  test('allow zero offset', () => {
    expect(hour.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 0))
      .toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
    expect(hour.offset(date.local(2010, 11, 31, 23, 59, 58, 0), 0))
      .toEqual(date.local(2010, 11, 31, 23, 59, 58, 0));
  });

  test('be able to generate a range of hours', () => {
    expect(hour.getRange(date.local(2010, 11, 31, 12, 30), date.local(2010, 11, 31, 15, 30)))
      .toEqual([
        date.local(2010, 11, 31, 13),
        date.local(2010, 11, 31, 14),
        date.local(2010, 11, 31, 15)
      ]);
  });

  test('be able to generate a range of hours which includes the lower bound', () => {
    expect(hour.getRange(date.local(2010, 11, 31, 23), date.local(2011, 0, 1, 2))[0])
      .toEqual(date.local(2010, 11, 31, 23));
  });

  test('be able to generate a range of hours which excludes the upper bound', () => {
    expect(hour.getRange(date.local(2010, 11, 31, 23), date.local(2011, 0, 1, 2))[2])
      .toEqual(date.local(2011, 0, 1, 1));
  });

  test('be able to skip hours when generating a range', () => {
    expect(hour.getRange(date.local(2011, 1, 1, 1), date.local(2011, 1, 1, 13), 3)).toEqual([
      date.local(2011, 1, 1, 1),
      date.local(2011, 1, 1, 4),
      date.local(2011, 1, 1, 7),
      date.local(2011, 1, 1, 10)
    ]);
  });

  test('generate a range that respects the start of daylight savings time', () => {
    expect(hour.getRange(date.local(2011, 2, 13, 1), date.local(2011, 2, 13, 5))).toEqual([
      date.utc(2011, 2, 12, 19, 30),
      date.utc(2011, 2, 12, 20, 30),
      date.utc(2011, 2, 12, 21, 30),
      date.utc(2011, 2, 12, 22, 30)
    ]);
  });

  test('generate a range that respects the end of daylight savings time', () => {
    expect(hour.getRange(date.local(2011, 10, 6, 0), date.local(2011, 10, 6, 2))).toEqual([
      date.utc(2011, 10, 5, 18, 30),
      date.utc(2011, 10, 5, 19, 30)
    ]);
  });

  test('generate an array of every stepth hour, starting with the first hour of the day', () => {
    expect(hour.every(4)
      .getRange(date.local(2008, 11, 30, 12, 47), date.local(2008, 11, 31, 13, 57)))
      .toEqual([
        date.local(2008, 11, 30, 16),
        date.local(2008, 11, 30, 20),
        date.local(2008, 11, 31, 0),
        date.local(2008, 11, 31, 4),
        date.local(2008, 11, 31, 8),
        date.local(2008, 11, 31, 12)
      ]);
    expect(hour.every(12)
      .getRange(date.local(2008, 11, 30, 12, 47), date.local(2008, 11, 31, 13, 57)))
      .toEqual([
        date.local(2008, 11, 31, 0),
        date.local(2008, 11, 31, 12)
      ]);
  });

  test('generates an array of every hour crossing the daylight savings boundary', () => {
    expect(hour
      .getRange(new Date(1478422800000 - (2 * 36e5)), new Date(1478422800000 + (2 * 36e5))))
      .toEqual([
        new Date(1478417400000), // Sun Nov 06 2016 13:00:00 GMT+0530 (IST)
        new Date(1478421000000), // Sun Nov 06 2016 14:00:00 GMT+0530 (IST)
        new Date(1478424600000), // Sun Nov 06 2016 15:00:00 GMT+0530 (IST)
        new Date(1478428200000) // Sun Nov 06 2016 16:00:00 GMT+0530 (IST)
      ]);
  });
});
