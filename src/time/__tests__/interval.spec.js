import * as date from './date';
import TimeInterval from '../interval';
import day from '../day';
import minute from '../minute';
import second from '../second';
import hour from '../hour';

describe('TimeInterval should create a custom interval', () => {
  test('with a floor and an offset', () => {
    const interval = new TimeInterval(
      d => d.setUTCMinutes(0, 0, 0),
      (d, s) => d.setUTCHours(d.getUTCHours() + s)
    );

    expect(interval.floor(date.utc(2015, 0, 1, 12, 34, 56, 789))).toEqual(date.utc(2015, 0, 1, 12));
  });

  test('and floor the step before passing it to offset', () => {
    const steps = [],
          interval = new TimeInterval(
            d => d.setUTCMinutes(0, 0, 0),
            (d, s) => {
              steps.push(Number(s));
              return d.setUTCHours(d.getUTCHours() + s);
            }
          );

    expect(interval.offset(date.utc(2015, 0, 1, 12, 34, 56, 789), 1.5))
      .toEqual(date.utc(2015, 0, 1, 13, 34, 56, 789));
    expect(interval.getRange(date.utc(2015, 0, 1, 12), date.utc(2015, 0, 1, 15), 1.5)).toEqual([
      date.utc(2015, 0, 1, 12),
      date.utc(2015, 0, 1, 13),
      date.utc(2015, 0, 1, 14)
    ]);
    expect(steps.every(step => step === 1)).toBeTruthy();
  });

  test('with a count of zero if count is not supplied to it', () => {
    const interval = new TimeInterval(
      d => d.setUTCMinutes(0, 0, 0),
      (d, s) => d.setUTCHours(d.getUTCHours() + s)
    );

    expect(interval.getCount()).toBe(0);
  });

  test('with a valid count if count is supplied to it', () => {
    const interval = new TimeInterval(
      d => d.setUTCMinutes(0, 0, 0),
      (d, s) => d.setUTCHours(d.getUTCHours() + s),
      (start, end) => (end - start) / 36e5
    );

    expect(interval.getCount(date.utc(2015, 0, 1, 12, 34), date.utc(2015, 0, 1, 15, 56))).toBe(3);
  });

  test('and floor dates before passing them to be counted', () => {
    const dates = [],
          interval = new TimeInterval(
            d => d.setUTCMinutes(0, 0, 0),
            (d, s) => date.setUTCHours(d.getUTCHours() + s),
            (s, e) => {
              dates.push(new Date(Number(s)), new Date(Number(e)));
              return (e - s) / 36e5;
            }
          );

    interval.getCount(date.utc(2015, 0, 1, 12, 34), date.utc(2015, 0, 1, 15, 56));
    expect(dates).toEqual([date.utc(2015, 0, 1, 12), date.utc(2015, 0, 1, 15)]);
  });

  test('which is unable to return times at every step if step is invalid', () => {
    expect(day.every()).toBeNull();
    expect(minute.every(null)).toBeNull();
    expect(second.every(undefined)).toBeNull();
    expect(day.every(NaN)).toBeNull();
    expect(minute.every(0)).toBeNull();
    expect(second.every(0.8)).toBeNull();
    expect(hour.every(-1)).toBeNull();
  });

  test('which returns itself when step is 1 for every interval', () => {
    expect(day.every('1')).toEqual(day);
    expect(minute.every(1)).toEqual(minute);
    expect(second.every(1.8)).toEqual(second);
  });

  test('which returns an empty array if an invalid range is asked for', () => {
    expect(minute.every(15).getRange(NaN, NaN)).toEqual([]);
  });

  describe('which returns the dates offset by a specified amount when', () => {
    test('step is positive', () => {
      const interval = minute.every(15);
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 0))
        .toEqual(date.local(2015, 0, 1, 12, 34));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 1))
        .toEqual(date.local(2015, 0, 1, 12, 45));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 2))
        .toEqual(date.local(2015, 0, 1, 13, 0));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 3))
        .toEqual(date.local(2015, 0, 1, 13, 15));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 4))
        .toEqual(date.local(2015, 0, 1, 13, 30));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 5))
        .toEqual(date.local(2015, 0, 1, 13, 45));
    });

    test('step is negative', () => {
      const interval = minute.every(15);

      expect(interval.offset(date.local(2015, 0, 1, 12, 34), -1))
        .toEqual(date.local(2015, 0, 1, 12, 30));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), -2))
        .toEqual(date.local(2015, 0, 1, 12, 15));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), -3))
        .toEqual(date.local(2015, 0, 1, 12, 0));
    });

    test('step is not an integer', () => {
      const interval = minute.every(15);

      expect(interval.offset(date.local(2015, 0, 1, 12, 34), 1.2))
        .toEqual(date.local(2015, 0, 1, 12, 45));
      expect(interval.offset(date.local(2015, 0, 1, 12, 34), -0.8))
        .toEqual(date.local(2015, 0, 1, 12, 30));
    });
  });
});
