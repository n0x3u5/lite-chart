import { monday, mondays } from '../week';
import { local as localDate } from './date';

describe('Mondays should', () => {
  test('be a short hand for a range of Mondays interval\'s range', () => {
    expect(mondays).toEqual(monday.getRange);
  });
});

describe('A time interval of Mondays should', () => {
  test('return only Mondays after flooring the dates', () => {
    expect(monday.floor(localDate(2011, 0, 1, 23, 59, 59)))
      .toEqual(localDate(2010, 11, 27));
    expect(monday.floor(localDate(2011, 0, 2, 0, 0, 0)))
      .toEqual(localDate(2010, 11, 27));
    expect(monday.floor(localDate(2011, 0, 2, 0, 0, 1)))
      .toEqual(localDate(2010, 11, 27));
    expect(monday.floor(localDate(2011, 0, 2, 23, 59, 59)))
      .toEqual(localDate(2010, 11, 27));
    expect(monday.floor(localDate(2011, 0, 3, 0, 0, 0)))
      .toEqual(localDate(2011, 0, 3));
    expect(monday.floor(localDate(2011, 0, 3, 0, 0, 1)))
      .toEqual(localDate(2011, 0, 3));
  });

  test('return an array of every stepth Monday when asked for', () => {
    expect(monday.getRange(localDate(2011, 11, 1), localDate(2012, 0, 15), 2)).toEqual([
      localDate(2011, 11, 5),
      localDate(2011, 11, 19),
      localDate(2012, 0, 2)
    ]);
  });

  test('count Mondays excluding the start and including the end dates', () => {
    //     January 2014
    // Su Mo Tu We Th Fr Sa
    //           1  2  3  4
    //  5  6  7  8  9 10 11
    // 12 13 14 15 16 17 18
    // 19 20 21 22 23 24 25
    // 26 27 28 29 30 31
    expect(monday.getCount(localDate(2014, 0, 1), localDate(2014, 0, 5))).toBe(0);
    expect(monday.getCount(localDate(2014, 0, 1), localDate(2014, 0, 6))).toBe(1);
    expect(monday.getCount(localDate(2014, 0, 1), localDate(2014, 0, 7))).toBe(1);
    expect(monday.getCount(localDate(2014, 0, 1), localDate(2014, 0, 13))).toBe(2);

    //     January 2018
    // Su Mo Tu We Th Fr Sa
    //     1  2  3  4  5  6
    //  7  8  9 10 11 12 13
    // 14 15 16 17 18 19 20
    // 21 22 23 24 25 26 27
    // 28 29 30 31
    expect(monday.getCount(localDate(2018, 0, 1), localDate(2018, 0, 7))).toBe(0);
    expect(monday.getCount(localDate(2018, 0, 1), localDate(2018, 0, 8))).toBe(1);
    expect(monday.getCount(localDate(2018, 0, 1), localDate(2018, 0, 9))).toBe(1);
  });

  test('observe daylight saving when counting Mondays', () => {
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 1))).toEqual(10);
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 3))).toEqual(10);
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 2, 13, 4))).toEqual(10);
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 0))).toEqual(44);
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 1))).toEqual(44);
    expect(monday.getCount(localDate(2011, 0, 1), localDate(2011, 10, 6, 2))).toEqual(44);
  });
});
