import timeDay from '../day';
import {
  sunday as timeSunday,
  monday as timeMonday
} from '../week';
import timeYear from '../year';

const pads = {
        '-': '',
        _: ' ',
        0: '0'
      },
      pad = (value, fill, width) => {
        const sign = value < 0 ? '-' : '',
              string = (sign ? -value : value).toString(),
              { length } = string;

        return sign + (
          length < width
            ? new Array((width - length) + 1).join(fill) + string
            : string
        );
      },
      formatDayOfMonth = (d, p) => pad(d.getDate(), p, 2),
      formatHour24 = (d, p) => pad(d.getHours(), p, 2),
      formatHour12 = (d, p) => pad(d.getHours() % 12 || 12, p, 2),
      formatDayOfYear = (d, p) => pad(1 + timeDay.count(timeYear.floor(d), d), p, 3),
      formatMilliseconds = (d, p) => pad(d.getMilliseconds(), p, 3),
      formatMonthNumber = (d, p) => pad(d.getMonth() + 1, p, 2),
      formatMinutes = (d, p) => pad(d.getMinutes(), p, 2),
      formatSeconds = (d, p) => pad(d.getSeconds(), p, 2),
      formatWeekNumberSunday = (d, p) => pad(timeSunday.count(timeYear.floor(d), d), p, 2),
      formatWeekdayNumber = d => d.getDay(),
      formatWeekNumberMonday = (d, p) => pad(timeMonday.count(timeYear.floor(d), d), p, 2),
      formatYear = (d, p) => pad(d.getFullYear() % 100, p, 2),
      formatFullYear = (d, p) => pad(d.getFullYear() % 10000, p, 4),
      formatZone = (d) => {
        let z = d.getTimezoneOffset(),
            sign;

        if (z > 0) {
          sign = '-';
        } else {
          z *= -1;
          sign = '+';
        }

        return sign + pad(Math.floor(z / 60), '0', 2) + pad(z % 60, '0', 2);
      },
      formatLiteralPercent = () => '%';

class TimeFormats {
  constructor (locale) {
    this.localeDateTime = locale.dateTime;
    this.localeDate = locale.date;
    this.localeTime = locale.time;
    this.localePeriods = locale.periods;
    this.localeWeekdays = locale.days;
    this.localeShortWeekdays = locale.shortDays;
    this.localeMonths = locale.months;
    this.localeShortMonths = locale.shortMonths;

    this.d = formatDayOfMonth;
    this.e = formatDayOfMonth;
    this.H = formatHour24;
    this.I = formatHour12;
    this.j = formatDayOfYear;
    this.L = formatMilliseconds;
    this.m = formatMonthNumber;
    this.M = formatMinutes;
    this.S = formatSeconds;
    this.U = formatWeekNumberSunday;
    this.w = formatWeekdayNumber;
    this.W = formatWeekNumberMonday;
    this.y = formatYear;
    this.Y = formatFullYear;
    this.Z = formatZone;
    this['%'] = formatLiteralPercent;

    this.x = this.factory(this.localeDate);
    this.X = this.factory(this.localeTime);
    this.c = this.factory(this.localeDateTime);
  }

  factory (specifier) {
    return (date) => {
      const string = [],
            n = specifier.length,
            d = date instanceof Date ? date : new Date(+date);

      let i = 0,
          j = 0,
          c,
          padding;

      while (i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          i += 1;
          c = specifier.charAt(i);
          padding = pads[c];
          if (padding != null) {
            i += 1;
            c = specifier.charAt(i);
          } else {
            padding = c === 'e' ? ' ' : '0';
          }
          if (this[c]) { c = this[c](d, padding); }
          string.push(c);
          j = i + 1;
        }
        i += 1;
      }

      string.push(specifier.slice(j, i));
      return string.join('');
    };
  }

  a (d) {
    return this.localeShortWeekdays[d.getDay()];
  }
  A (d) {
    return this.localeWeekdays[d.getDay()];
  }
  b (d) {
    return this.localeShortMonths[d.getMonth()];
  }
  B (d) {
    return this.localeMonths[d.getMonth()];
  }
  p (d) {
    return this.localePeriods[Number(d.getHours() >= 12)];
  }
}

export default TimeFormats;
