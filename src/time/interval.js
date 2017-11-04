/* eslint no-sequences: "off", no-plusplus: "off" */
const t0 = new Date(),
      t1 = new Date();

class TimeInterval {
  constructor (floori, offseti, count, field) {
    this.floori = floori;
    this.offseti = offseti;
    this.count = count;
    this.field = field;
  }

  floor (date) {
    const newDate = new Date(Number(date));

    this.floori(newDate);

    return newDate;
  }

  ceil (date) {
    const datei = new Date(date - 1);

    this.floori(datei, this.offseti(datei, 1), this.floori(datei));

    return datei;
  }

  round (date) {
    const d0 = this.floor(date),
          d1 = this.ceil(date);

    return date - d0 < d1 - date ? d0 : d1;
  }

  offset (date, step) {
    const datei = new Date(Number(date));

    this.offseti(datei, step == null ? 1 : Math.floor(step));

    return datei;
  }

  getRange (start, stop, step) {
    const range = [],
          starti = this.ceil(start),
          stepi = step == null ? 1 : Math.floor(step);

    let previous;

    if (!(starti < stop) || !(stepi > 0)) return range;

    do {
      previous = new Date(Number(starti));
      range.push(previous);
      this.offseti(starti, stepi);
      this.floori(starti);
    } while (previous < starti && starti < stop);

    return range;
  }

  filter (test) {
    return new TimeInterval((date) => {
      if (!Number.isNaN(Number(date))) {
        while (this.floori(date), !test(date)) {
          date.setTime(date - 1);
        }
      }
    }, (date, step) => {
      let stepi = step;

      if (!Number.isNaN(Number(date))) {
        if (stepi < 0) {
          while (++stepi <= 0) {
            while (this.offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          }
        } else {
          while (--stepi >= 0) {
            while (this.offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      }
    });
  }

  getCount (start, end) {
    let count = 0;

    if (this.count) {
      t0.setTime(Number(start));
      t1.setTime(Number(end));

      this.floori(t0);
      this.floori(t1);

      count = Math.floor(this.count(t0, t1));
    }

    return count;
  }

  every (step) {
    const stepi = Math.floor(step);
    let everyInterval = null;

    if (!this.count || !Number.isFinite(stepi) || !(stepi > 0)) {
      everyInterval = null;
    } else if (!(stepi > 1)) {
      everyInterval = this;
    } else {
      everyInterval = this.filter(this.field
        ? d => this.field(d) % stepi === 0
        : d => this.getCount(0, d) % stepi === 0);
    }

    return everyInterval;
  }
}

export default TimeInterval;
