import bisector from '../utils/bisector';
import { tickStep } from '../utils/ticks';
import timeYear from '../time/year';
import timeMonth from '../time/month';
import timeWeek from '../time/week';
import timeDay from '../time/day';
import timeHour from '../time/hour';
import timeMinute from '../time/minute';
import timeSecond from '../time/second';
import timeMillisecond from '../time/millisecond';
import reinterpolate from '../utils/interpolators/number';
import ScaleContinuous, { copyScale, deinterpolateLinear as deinterpolate } from './continuous';

const durationSecond = 1000,
      durationMinute = durationSecond * 60,
      durationHour = durationMinute * 60,
      durationDay = durationHour * 24,
      durationWeek = durationDay * 7,
      durationMonth = durationDay * 30,
      durationYear = durationDay * 365,
      date = d => new Date(d),
      number = n => (n instanceof Date ? +n : +new Date(+n)),
      nice = (domain, interval) => {
        const d = domain.slice();
        let i0 = 0,
            i1 = d.length - 1,
            x0 = d[i0],
            x1 = d[i1],
            t;

        if (x1 < x0) {
          t = i0;
          i0 = i1;
          i1 = t;
          t = x0;
          x0 = x1;
          x1 = t;
        }

        d[i0] = interval.floor(x0);
        d[i1] = interval.ceil(x1);

        return d;
      };

class ScaleCalendar extends ScaleContinuous {
  constructor (year, month, week, day, hour, minute, second, millisecond) {
    super(deinterpolate, reinterpolate);

    this.year = year;
    this.month = month;
    this.week = week;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;

    this.tickIntervals = [
      [this.second, 1, durationSecond],
      [this.second, 5, 5 * durationSecond],
      [this.second, 15, 15 * durationSecond],
      [this.second, 30, 30 * durationSecond],
      [this.minute, 1, durationMinute],
      [this.minute, 5, 5 * durationMinute],
      [this.minute, 15, 15 * durationMinute],
      [this.minute, 30, 30 * durationMinute],
      [this.hour, 1, durationHour],
      [this.hour, 3, 3 * durationHour],
      [this.hour, 6, 6 * durationHour],
      [this.hour, 12, 12 * durationHour],
      [this.day, 1, durationDay],
      [this.day, 2, 2 * durationDay],
      [this.week, 1, durationWeek],
      [this.month, 1, durationMonth],
      [this.month, 3, 3 * durationMonth],
      [this.year, 1, durationYear]
    ];
  }

  setDomain (domain) {
    return super.setDomain(domain.map(number));
  }
  getDomain () {
    return super.getDomain().map(date);
  }

  tickInterval (interval = 10, start, stop, step) {
    let s = step,
        i = interval;

    // If tick count is specified, use a reasonable tick interval
    // based on the domain's extent and an estimated tick size.
    // Else assume that the interval is already a time interval and use it.
    if (typeof i === 'number') {
      const target = Math.abs(stop - start) / i;
      let tickNum = bisector(n => n[2]).right(this.tickIntervals, target);

      if (tickNum === this.tickIntervals.length) {
        s = tickStep(start / durationYear, stop / durationYear, i);
        i = this.year;
      } else if (tickNum) {
        const idx = (target / this.tickIntervals[tickNum - 1][2]) <
          (this.tickIntervals[tickNum][2] / target)
          ? tickNum - 1
          : tickNum;
        tickNum = this.tickIntervals[idx];
        s = tickNum[1];
        i = tickNum[0];
      } else {
        s = tickStep(start, stop, i);
        i = this.millisecond;
      }
    }

    return s == null ? i : i.every(s);
  }

  ticks (interval, step) {
    const domain = super.getDomain();

    let t0 = domain[0],
        t1 = domain[domain.length - 1],
        ticks;

    const isReverse = t1 < t0;

    if (isReverse) {
      ticks = t0;
      t0 = t1;
      t1 = ticks;
    }

    ticks = this.tickInterval(interval, t0, t1, step);
    ticks = ticks ? ticks.getRange(t0, t1 + 1) : [];

    return isReverse ? ticks.reverse() : ticks;
  }

  nice (interval, step) {
    const d = super.getDomain();
    const i = this.tickInterval(interval, d[0], d[d.length - 1], step);

    return i ? super.setDomain(nice(d, i)) : this;
  }

  getDomainForRange (range) {
    return new Date(super.getDomainForRange(range));
  }

  copy () {
    return copyScale(this, new ScaleCalendar(
      this.year,
      this.month,
      this.week,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond
    ));
  }
}

class ScaleTime extends ScaleCalendar {
  constructor () {
    super(
      timeYear,
      timeMonth,
      timeWeek,
      timeDay,
      timeHour,
      timeMinute,
      timeSecond,
      timeMillisecond
    );
  }
}

export default ScaleTime;
