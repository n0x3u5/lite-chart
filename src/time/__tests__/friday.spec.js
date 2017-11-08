import { local as localDate } from './date';
import { fridays, friday } from '../week';

describe('Fridays should', () => {
  test('be an alias for a range of Fridays', () => {
    expect(fridays).toEqual(friday.getRange);
  });
});

describe('A time interval of Fridays should', () => {
  test('return only Fridays after flooring dates', () => {
    expect(friday.floor(localDate(2011, 0, 5, 23, 59, 59))).toEqual(localDate(2010, 11, 31));
    expect(friday.floor(localDate(2011, 0, 6, 0, 0, 0))).toEqual(localDate(2010, 11, 31));
    expect(friday.floor(localDate(2011, 0, 6, 0, 0, 1))).toEqual(localDate(2010, 11, 31));
    expect(friday.floor(localDate(2011, 0, 6, 23, 59, 59))).toEqual(localDate(2010, 11, 31));
    expect(friday.floor(localDate(2011, 0, 7, 0, 0, 0))).toEqual(localDate(2011, 0, 7));
    expect(friday.floor(localDate(2011, 0, 7, 0, 0, 1))).toEqual(localDate(2011, 0, 7));
  });

  test('be able to count Fridays after start (exclusive) and before end (inclusive)', () => {
    /*
    October 2017
    Su Mo Tu We Th Fr Sa
     1  2  3  4  5  6  7
     8  9 10 11 12 13 14
    15 16 17 18 19 20 21
    22 23 24 25 26 27 28
    29 30 31
    */
    expect(friday.getCount(localDate(2017, 9, 1), localDate(2017, 9, 5))).toBe(0);
    expect(friday.getCount(localDate(2017, 9, 1), localDate(2017, 9, 6))).toBe(1);
    expect(friday.getCount(localDate(2017, 9, 1), localDate(2017, 9, 7))).toBe(1);
    expect(friday.getCount(localDate(2017, 9, 1), localDate(2017, 9, 13))).toBe(2);

    /*
    December 2017
    Su Mo Tu We Th Fr Sa
                    1  2
     3  4  5  6  7  8  9
    10 11 12 13 14 15 16
    17 18 19 20 21 22 23
    24 25 26 27 28 29 30
    31
    */
    expect(friday.getCount(localDate(2017, 11, 1), localDate(2017, 11, 7))).toBe(0);
    expect(friday.getCount(localDate(2017, 11, 1), localDate(2017, 11, 8))).toBe(1);
    expect(friday.getCount(localDate(2017, 11, 1), localDate(2017, 11, 9))).toBe(1);
  });

  test('respect daylight saving', () => {
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 1))).toBe(10);
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 3))).toBe(10);
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 4))).toBe(10);
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 0))).toBe(44);
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 1))).toBe(44);
    expect(friday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 2))).toBe(44);
  });
});
