import TimeInterval from './interval';

class MillisecondInterval extends TimeInterval {
  // Optimized implementation in case of a millisecond time interval
  every (step) {
    const stepi = Math.floor(step);

    if (!this.count || !Number.isFinite(stepi) || !(stepi > 0)) {
      return null;
    }

    if (!(stepi > 1)) {
      return this;
    }

    return this.floor(
      d => d.setTime(Math.floor(d / stepi) * stepi),
      (d, s) => d.setTime((Number(d) + s) * stepi),
      (s, e) => (e - s) / stepi
    );
  }
}

export default MillisecondInterval;
