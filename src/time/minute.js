import TimeInterval from './interval';
import { durationMinute } from './duration';

const minute = new TimeInterval(
        d => d.setTime(Math.floor(d / durationMinute) * durationMinute),
        (d, s) => d.setTime(Number(d) + (s * durationMinute)),
        (s, e) => (e - s) / durationMinute,
        d => d.getMinutes()
      ),
      minutes = minute.getRange;

export default minute;
export { minutes };
