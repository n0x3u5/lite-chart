import reinterpolate from '../utils/interpolators/number';
import ticks, { tickIncrement } from '../utils/ticks';
import ScaleContinuous, { copyScale, deinterpolateLinear as deinterpolate } from './continuous';

class ScaleLinear extends ScaleContinuous {
  constructor () {
    super(deinterpolate, reinterpolate);
  }

  ticks (count = 7) {
    const d = this.getDomain();

    return ticks(d[0], d[d.length - 1], count);
  }

  nice (count = 7) {
    const d = this.getDomain();

    let i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start;
      start = stop;
      stop = step;

      step = i0;
      i0 = i1;
      i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      this.setDomain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      this.setDomain(d);
    }

    return this;
  }

  copy () {
    return copyScale(this, new ScaleLinear(deinterpolate, reinterpolate));
  }
}

export default ScaleLinear;
