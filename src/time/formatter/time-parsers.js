/* eslint no-param-reassign: ["error", { "props": false }] */

const utcDate = (d) => {
        if (d.y >= 0 && d.y < 100) {
          const date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
          date.setUTCFullYear(d.y);
          return date;
        }
        return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
      },
      pads = {
        '-': '',
        _: ' ',
        0: '0'
      },
      numberRe = /^\s*\d+/,
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g,
      requote = s => s.replace(requoteRe, '\\$&'),
      formatRe = names => new RegExp(`^(?:${names.map(requote).join('|')})`, 'i'),
      formatLookup = (names) => {
        const map = {},
              n = names.length;

        let i = 0;

        while (i < n) {
          map[names[i].toLowerCase()] = i;
          i += 1;
        }

        return map;
      },
      newYear = y => ({
        y,
        m: 0,
        d: 1,
        H: 0,
        M: 0,
        S: 0,
        L: 0
      }),
      parseDayOfMonth = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.d = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseHour24 = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.H = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseDayOfYear = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 3));
        let result = -1;

        if (n) {
          d.m = 0;
          d.d = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseMilliseconds = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 3));
        let result = -1;

        if (n) {
          d.L = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseMonthNumber = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.m = n[0] - 1;
          result = i + n[0].length;
        }

        return result;
      },
      parseMinutes = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.M = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseSeconds = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.S = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseWeekNumberSunday = (d, string, i) => {
        const n = numberRe.exec(string.slice(i));
        let result = -1;

        if (n) {
          d.U = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseWeekdayNumber = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 1));
        let result = -1;

        if (n) {
          d.w = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseWeekNumberMonday = (d, string, i) => {
        const n = numberRe.exec(string.slice(i));
        let result = -1;

        if (n) {
          d.W = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseFullYear = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 4));
        let result = -1;

        if (n) {
          d.y = Number(n[0]);
          result = i + n[0].length;
        }

        return result;
      },
      parseYear = (d, string, i) => {
        const n = numberRe.exec(string.slice(i, i + 2));
        let result = -1;

        if (n) {
          d.y = Number(n[0]) + (Number(n[0]) > 68 ? 1900 : 2000);
          result = i + n[0].length;
        }

        return result;
      },
      parseZone = (d, string, i) => {
        const n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
        let result = -1;

        if (n) {
          d.Z = n[1] ? 0 : -(n[2] + (n[3] || '00'));
          result = i + n[0].length;
        }

        return result;
      },
      parseLiteralPercent = (d, string, i) => {
        const n = percentRe.exec(string.slice(i, i + 1));

        return n ? i + n[0].length : -1;
      };

class TimeParsers {
  constructor (locale) {
    this.localeDateTime = locale.dateTime;
    this.localeDate = locale.date;
    this.localeTime = locale.time;
    this.localePeriods = locale.periods;
    this.localeWeekdays = locale.days;
    this.localeShortWeekdays = locale.shortDays;
    this.localeMonths = locale.months;
    this.localeShortMonths = locale.shortMonths;

    this.periodRe = formatRe(this.localePeriods);
    this.periodLookup = formatLookup(this.localePeriods);
    this.weekdayRe = formatRe(this.localeWeekdays);
    this.weekdayLookup = formatLookup(this.localeWeekdays);
    this.shortWeekdayRe = formatRe(this.localeShortWeekdays);
    this.shortWeekdayLookup = formatLookup(this.localeShortWeekdays);
    this.monthRe = formatRe(this.localeMonths);
    this.monthLookup = formatLookup(this.localeMonths);
    this.shortMonthRe = formatRe(this.localeShortMonths);
    this.shortMonthLookup = formatLookup(this.localeShortMonths);

    this['%'] = parseLiteralPercent;
    this.d = parseDayOfMonth;
    this.e = parseDayOfMonth;
    this.H = parseHour24;
    this.I = parseHour24;
    this.j = parseDayOfYear;
    this.L = parseMilliseconds;
    this.m = parseMonthNumber;
    this.M = parseMinutes;
    this.S = parseSeconds;
    this.U = parseWeekNumberSunday;
    this.w = parseWeekdayNumber;
    this.W = parseWeekNumberMonday;
    this.y = parseYear;
    this.Y = parseFullYear;
    this.Z = parseZone;
  }

  parseSpecifier (d, specifier, string, j) {
    const n = specifier.length,
          m = string.length;

    let i = 0,
        k = j,
        c,
        parse;

    while (i < n) {
      if (k >= m) return -1;
      c = specifier.charCodeAt(i);
      i += 1;

      // 37 is the character code of the % symbol
      if (c === 37) {
        c = specifier.charAt(i);
        i += 1;
        parse = this[c in pads ? specifier.charAt(i) : c];
        i += 1;
        k = parse(d, string, k);
        if (!parse || (k < 0)) return -1;
      } else {
        if (c !== string.charCodeAt(k)) {
          return -1;
        }
        k += 1;
      }
    }

    return k;
  }

  factory (specifier, newDate) {
    return (string) => {
      const d = newYear(1900),
            str = string.toString(),
            i = this.parseSpecifier(d, specifier, str, 0);

      if (i !== str.length) return null;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ('p' in d) d.H = (d.H % 12) + (d.p * 12);

      // Convert day-of-week and week-of-year to day-of-year.
      if ('W' in d || 'U' in d) {
        if (!('w' in d)) d.w = 'W' in d ? 1 : 0;
        const day = 'Z' in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = 'W' in d
          ? (((d.w + 6) % 7) + (d.W * 7)) - ((day + 5) % 7)
          : (d.w + (d.U * 7)) - ((day + 6) % 7);
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ('Z' in d) {
        d.H += Math.floor(d.Z / 100);
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  a (d, str, i) {
    const n = this.shortWeekdayRe.exec(str.slice(i));
    let result = -1;

    if (n) {
      d.w = this.shortWeekdayLookup[n[0].toLowerCase()];
      result = i + n[0].length;
    }

    return result;
  }
  A (d, str, i) {
    const n = this.weekdayRe.exec(str.slice(i));
    let result = -1;

    if (n) {
      d.w = this.weekdayLookup[n[0].toLowerCase()];
      result = i + n[0].length;
    }
    return result;
  }
  b (d, str, i) {
    const n = this.shortMonthRe.exec(str.slice(i));
    let result = -1;

    if (n) {
      d.m = this.shortMonthLookup[n[0].toLowerCase()];
      result = i + n[0].length;
    }
    return result;
  }
  B (d, str, i) {
    const n = this.monthRe.exec(str.slice(i));
    let result = -1;

    if (n) {
      d.m = this.monthLookup[n[0].toLowerCase()];
      result = i + n[0].length;
    }
    return result;
  }
  c (d, str, i) {
    return this.parseSpecifier(d, this.localeDateTime, str, i);
  }
  p (d, str, i) {
    const n = this.periodRe.exec(str.slice(i));
    let result = -1;

    if (n) {
      d.p = this.periodLookup[n[0].toLowerCase()];
      result = i + n[0].length;
    }

    return result;
  }
  x (d, str, i) {
    return this.parseSpecifier(d, this.localeDate, str, i);
  }
  X (d, str, i) {
    return this.parseSpecifier(d, this.localeTime, str, i);
  }
}

export default TimeParsers;
