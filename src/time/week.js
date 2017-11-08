import TimeInterval from './interval';
import { durationMinute, durationWeek } from './duration';

const weekday = i => new TimeInterval(
        (d) => {
          d.setDate(d.getDate() - (((d.getDay() + 7) - i) % 7));
          d.setHours(0, 0, 0, 0);
        },
        (d, s) => d.setDate(d.getDate() + (s * 7)),
        (s, e) => ((e - s) - ((e.getTimezoneOffset() - s.getTimezoneOffset()) *
          durationMinute)) / durationWeek
      ),
      sunday = weekday(0),
      sundays = sunday.getRange,
      monday = weekday(1),
      mondays = monday.getRange,
      tuesday = weekday(2),
      tuesdays = tuesday.getRange,
      wednesday = weekday(3),
      wednesdays = wednesday.getRange,
      thursday = weekday(4),
      thursdays = thursday.getRange,
      friday = weekday(5),
      fridays = friday.getRange,
      saturday = weekday(6),
      saturdays = saturday.getRange,
      week = sunday,
      weeks = sundays;

export default week;

export {
  weeks,
  sunday,
  sundays,
  monday,
  mondays,
  tuesday,
  tuesdays,
  wednesday,
  wednesdays,
  thursday,
  thursdays,
  friday,
  fridays,
  saturday,
  saturdays
};
