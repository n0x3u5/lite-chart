import YearInterval from './year-interval';

const year = new YearInterval(
        (d) => {
          d.setMonth(0, 1);
          d.setHours(0, 0, 0, 0);
        },
        (d, s) => d.setFullYear(d.getFullYear() + s),
        (s, e) => e.getFullYear() - s.getFullYear(),
        d => d.getFullYear()
      ),
      years = year.range;

export default year;
export { years };
