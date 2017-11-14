/* eslint no-param-reassign: ["error", { "props": false }] */
import TimeFormats from './time-formats';
import TimeParsers from './time-parsers';

const localDate = (d) => {
  if (d.y >= 0 && d.y < 100) {
    const date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
};

class TimeFormatter {
  constructor (locale) {
    this.formats = new TimeFormats(locale);
    this.parsers = new TimeParsers(locale);
  }

  format (specifier) {
    const f = this.formats.factory(specifier.toString());
    f.toString = () => specifier;
    return f;
  }

  parse (specifier) {
    const p = this.parsers.factory(specifier.toString(), localDate);
    p.toString = () => specifier;
    return p;
  }
}

export default TimeFormatter;
