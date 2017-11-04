import TimeInterval from './interval';

class Yearinterval extends TimeInterval {
  every (step) {
    const stepi = Math.floor(step);

    if (!this.count || !Number.isFinite(stepi) || !(stepi > 0)) {
      return null;
    }

    return this.floor((d) => {
      d.setFullYear(Math.floor(d.getFullYear() / stepi) * stepi);
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
    }, (d, s) => d.setFullYear((d.getFullYear() + s) * stepi));
  }
}

export default Yearinterval;
