import minute from '../minute';
import * as date from './date';

describe('A minute interval should', () => {
  test('be able to floor a given time to te nearest minute', () => {
    expect(minute.floor(date.local(2010, 11, 31, 23, 59, 59)))
      .toEqual(date.local(2010, 11, 31, 23, 59));
    expect(minute.floor(date.local(2011, 0, 1, 0, 0, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 0));
    expect(minute.floor(date.local(2011, 0, 1, 0, 0, 59)))
      .toEqual(date.local(2011, 0, 1, 0, 0));
    expect(minute.floor(date.local(2011, 0, 1, 0, 1, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 1));
  });

  test('be able to raise a given time to te nearest minute', () => {
    expect(minute.ceil(date.local(2010, 11, 31, 23, 59, 59)))
      .toEqual(date.local(2011, 0, 1, 0, 0));
    expect(minute.ceil(date.local(2011, 0, 1, 0, 0, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 0));
    expect(minute.ceil(date.local(2011, 0, 1, 0, 0, 59)))
      .toEqual(date.local(2011, 0, 1, 0, 1));
    expect(minute.ceil(date.local(2011, 0, 1, 0, 1, 0)))
      .toEqual(date.local(2011, 0, 1, 0, 1));
  });

  test('be able to offset a time without modifying the input time', () => {
    const d = date.local(2010, 11, 31, 23, 59, 59, 999);

    minute.offset(d, 1);

    expect(d).toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
  });

  test('be able to offset a time without rounding the input time', () => {
    expect(minute.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 1))
      .toEqual(date.local(2011, 0, 1, 0, 0, 59, 999));
    expect(minute.offset(date.local(2010, 11, 31, 23, 59, 59, 456), -2))
      .toEqual(date.local(2010, 11, 31, 23, 57, 59, 456));
  });

  test('allow negative offsets', () => {
    expect(minute.offset(date.local(2010, 11, 31, 23, 12), -1))
      .toEqual(date.local(2010, 11, 31, 23, 11));
    expect(minute.offset(date.local(2011, 0, 1, 0, 1), -2))
      .toEqual(date.local(2010, 11, 31, 23, 59));
    expect(minute.offset(date.local(2011, 0, 1, 0, 0), -1))
      .toEqual(date.local(2010, 11, 31, 23, 59));
  });

  test('allow positive offsets', () => {
    expect(minute.offset(date.local(2010, 11, 31, 23, 11), +1))
      .toEqual(date.local(2010, 11, 31, 23, 12));
    expect(minute.offset(date.local(2010, 11, 31, 23, 59), +2))
      .toEqual(date.local(2011, 0, 1, 0, 1));
    expect(minute.offset(date.local(2010, 11, 31, 23, 59), +1))
      .toEqual(date.local(2011, 0, 1, 0, 0));
  });

  test('allow zero offset', () => {
    expect(minute.offset(date.local(2010, 11, 31, 23, 59, 59, 999), 0))
      .toEqual(date.local(2010, 11, 31, 23, 59, 59, 999));
    expect(minute.offset(date.local(2010, 11, 31, 23, 59, 58, 0), 0))
      .toEqual(date.local(2010, 11, 31, 23, 59, 58, 0));
  });

  test('be able to return a range of minutes', () => {
    expect(minute.getRange(date.local(2010, 11, 31, 23, 59), date.local(2011, 0, 1, 0, 2)))
      .toEqual([
        date.local(2010, 11, 31, 23, 59),
        date.local(2011, 0, 1, 0, 0),
        date.local(2011, 0, 1, 0, 1)
      ]);
  });

  test('include the lower bound in its range', () => {
    expect(minute.getRange(date.local(2010, 11, 31, 23, 59), date.local(2011, 0, 1, 0, 2))[0])
      .toEqual(date.local(2010, 11, 31, 23, 59));
  });

  test('exclude the upper bound in its range', () => {
    expect(minute.getRange(date.local(2010, 11, 31, 23, 59), date.local(2011, 0, 1, 0, 2))[2])
      .toEqual(date.local(2011, 0, 1, 0, 1));
  });

  test('be able to skip minutes from its range when asked to', () => {
    expect(minute.getRange(date.local(2011, 1, 1, 12, 7), date.local(2011, 1, 1, 13, 7), 15))
      .toEqual([
        date.local(2011, 1, 1, 12, 7),
        date.local(2011, 1, 1, 12, 22),
        date.local(2011, 1, 1, 12, 37),
        date.local(2011, 1, 1, 12, 52)
      ]);
  });

  test('respect the start of daylight savings time when calculating its range', () => {
    expect(minute.getRange(date.utc(2011, 2, 13, 9, 59), date.utc(2011, 2, 13, 10, 2))).toEqual([
      date.utc(2011, 2, 13, 9, 59),
      date.utc(2011, 2, 13, 10, 0),
      date.utc(2011, 2, 13, 10, 1)
    ]);
  });

  test('respect the end of daylight savings time when calculating its range', () => {
    expect(minute.getRange(date.utc(2011, 10, 6, 8, 59), date.utc(2011, 10, 6, 9, 2))).toEqual([
      date.utc(2011, 10, 6, 8, 59),
      date.utc(2011, 10, 6, 9, 0),
      date.utc(2011, 10, 6, 9, 1)
    ]);
  });

  test('return an array every stepth minute, starting with the first minute of the hour', () => {
    expect(minute
      .every(15)
      .getRange(date.local(2008, 11, 30, 12, 47), date.local(2008, 11, 30, 13, 57)))
      .toEqual([
        date.local(2008, 11, 30, 13, 0),
        date.local(2008, 11, 30, 13, 15),
        date.local(2008, 11, 30, 13, 30),
        date.local(2008, 11, 30, 13, 45)
      ]);
    expect(minute
      .every(30)
      .getRange(date.local(2008, 11, 30, 12, 47), date.local(2008, 11, 30, 13, 57)))
      .toEqual([
        date.local(2008, 11, 30, 13, 0),
        date.local(2008, 11, 30, 13, 30)
      ]);
  });

  test('return an array of every minute crossing the daylight savings boundary', () => {
    expect(minute
      .getRange(new Date(1478422800000 - (2 * 6e4)), new Date(1478422800000 + (2 * 6e4))))
      .toEqual([
        new Date(1478422680000), // Sun Nov 06 2016 14:28:00 GMT+0530 (IST)
        new Date(1478422740000), // Sun Nov 06 2016 14:29:00 GMT+0530 (IST)
        new Date(1478422800000), // Sun Nov 06 2016 14:30:00 GMT+0530 (IST)
        new Date(1478422860000) // Sun Nov 06 2016 14:31:00 GMT+0530 (IST)
      ]);
  });
});
