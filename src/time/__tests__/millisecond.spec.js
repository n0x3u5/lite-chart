import millisecond from '../millisecond';
import * as date from './date';

test('timeMillisecond.every(step) returns every stepth millisecond, starting with the first millisecond of the second', () => {
  expect(millisecond
    .every(50)
    .getRange(date.local(2008, 11, 30, 12, 36, 0, 947), date.local(2008, 11, 30, 12, 36, 1, 157)))
    .toEqual([
      date.local(2008, 11, 30, 12, 36, 0, 950),
      date.local(2008, 11, 30, 12, 36, 1, 0),
      date.local(2008, 11, 30, 12, 36, 1, 50),
      date.local(2008, 11, 30, 12, 36, 1, 100),
      date.local(2008, 11, 30, 12, 36, 1, 150)
    ]);
  expect(millisecond
    .every(100)
    .getRange(date.local(2008, 11, 30, 12, 36, 0, 947), date.local(2008, 11, 30, 12, 36, 1, 157)))
    .toEqual([
      date.local(2008, 11, 30, 12, 36, 1, 0),
      date.local(2008, 11, 30, 12, 36, 1, 100)
    ]);
  expect(millisecond
    .every(50)
    .getRange(date.utc(2008, 11, 30, 12, 36, 0, 947), date.utc(2008, 11, 30, 12, 36, 1, 157)))
    .toEqual([
      date.utc(2008, 11, 30, 12, 36, 0, 950),
      date.utc(2008, 11, 30, 12, 36, 1, 0),
      date.utc(2008, 11, 30, 12, 36, 1, 50),
      date.utc(2008, 11, 30, 12, 36, 1, 100),
      date.utc(2008, 11, 30, 12, 36, 1, 150)
    ]);
  expect(millisecond
    .every(100)
    .getRange(date.utc(2008, 11, 30, 12, 36, 0, 947), date.utc(2008, 11, 30, 12, 36, 1, 157)))
    .toEqual([
      date.utc(2008, 11, 30, 12, 36, 1, 0),
      date.utc(2008, 11, 30, 12, 36, 1, 100)
    ]);
});
