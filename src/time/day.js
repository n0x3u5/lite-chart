import TimeInterval from './interval';
import { durationDay, durationMinute } from './duration';

const day = new TimeInterval(
        d => d.setHours(0, 0, 0, 0),
        (d, s) => d.setDate(d.getDate() + s),
        (s, e) => ((e - s) -
          ((e.getTimezoneOffset() - s.getTimezoneOffset()) * durationMinute)) / durationDay,
        d => d.getDate() - 1
      ),
      days = day.getRange;

export default day;
export { days };
