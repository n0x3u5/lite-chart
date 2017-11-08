import TimeInterval from './interval';
import { durationSecond } from './duration';

const second = new TimeInterval(
        d => d.setTime(Math.floor(d / durationSecond) * durationSecond),
        (d, s) => d.setTime(Number(d) + (s * durationSecond)),
        (s, e) => (e - s) / durationSecond,
        d => d.getUTCSeconds()
      ),
      seconds = second.getRange;

export default second;
export { seconds };
