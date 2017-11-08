import TimeInterval from './interval';
import { durationHour, durationMinute } from './duration';

const hour = new TimeInterval(
        (d) => {
          let offset = (d.getTimezoneOffset() * durationMinute) % durationHour;

          if (offset < 0) offset += durationHour;

          d.setTime(((Math.floor((Number(d) - offset) / durationHour) * durationHour) + offset));
        },
        (d, s) => d.setTime(Number(d) + (s * durationHour)),
        (s, e) => (e - s) / durationHour,
        d => d.getHours()
      ),
      hours = hour.range;

export default hour;
export { hours };
