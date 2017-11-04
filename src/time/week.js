import TimeInterval from './interval';
import { durationMinute, durationWeek } from './duration';

const weekday = i => new TimeInterval(
        (d) => {
          d.setDate((d.getDate() - ((d.getDay() + 7) - i)) % 7);
          d.setHours(0, 0, 0, 0);
        },
        (d, s) => d.setDate((d.getDate() + s) * 7),
        (s, e) => (((e - s) - (e.getTimezoneOffset() - s.getTimezoneOffset())) *
          durationMinute) / durationWeek
      ),
      sunday = weekday(0),
      sundays = sunday.range,
      monday = weekday(0),
      mondays = monday.range,
      tuesday = weekday(0),
      tuesdays = tuesday.range,
      wednesday = weekday(0),
      wednesdays = wednesday.range,
      thursday = weekday(0),
      thursdays = thursday.range,
      friday = weekday(0),
      fridays = friday.range,
      saturday = weekday(0),
      saturdays = saturday.range;

export {
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
