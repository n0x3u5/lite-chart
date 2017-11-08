import MillisecondInterval from './ms-interval';

const millisecond = new MillisecondInterval(
        () => { /* no-op */ },
        (d, s) => d.setTime(Number(d), Number(s)),
        (s, e) => e - s
      ),
      milliseconds = millisecond.getRange;

export default millisecond;
export { milliseconds };
