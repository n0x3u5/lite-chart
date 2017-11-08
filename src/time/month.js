import TimeInterval from './interval';

const month = new TimeInterval(
        (d) => {
          d.setDate(1);
          d.setHours(0, 0, 0, 0);
        },
        (d, s) => d.setMonth(d.getMonth() + s),
        (s, e) => (e.getMonth() - s.getMonth()) + ((e.getFullYear() - s.getFullYear()) * 12),
        d => d.getMonth()
      ),
      months = month.getRange;

export default month;
export { months };
