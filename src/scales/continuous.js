import bisect from '../utils/bisect';
import constant from '../utils/constant';
import interpolateValue from '../utils/interpolators/value';
import interpolateRound from '../utils/interpolators/round';

const UNIT = [0, 1];

function deinterpolateLinear (a, b) {
  const from = Number(a);
  let to = b;

  to -= from;

  return to ? x => (x - from) / to : constant(to);
}

function deinterpolateClamp (deinterpolate) {
  return (a, b) => {
    const from = Number(a),
          to = Number(b),
          d = deinterpolate(from, to);

    return (x) => {
      if (x <= a) {
        return 0;
      }

      if (x >= b) {
        return 1;
      }

      return d(x);
    };
  };
}

function reinterpolateClamp (reinterpolate) {
  return (a, b) => {
    const from = Number(a),
          to = Number(b),
          r = reinterpolate(from, to);

    return (x) => {
      if (x <= 0) {
        return from;
      }

      if (x >= 1) {
        return to;
      }

      return r(x);
    };
  };
}

function bimap (domain, range, deinterpolate, reinterpolate) {
  const d1 = domain[1],
        r1 = range[1];

  let d0 = domain[0],
      r0 = range[0];

  if (d1 < d0) {
    d0 = deinterpolate(d1, d0);
    r0 = reinterpolate(r1, r0);
  } else {
    d0 = deinterpolate(d0, d1);
    r0 = reinterpolate(r0, r1);
  }

  return x => r0(d0(x));
}

function copyScale (sourceScale, targetScale) {
  return targetScale
    .setDomain(sourceScale.getDomain())
    .setRange(sourceScale.getRange())
    .setInterpolator(sourceScale.getInterpolator())
    .setClamp(sourceScale.getClamp());
}

function polymap (domain, range, deinterpolate, reinterpolate) {
  const j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j);

  let localDomain = domain.slice(),
      localRange = range.slice(),
      i = 0;

  if (localDomain[j] < localDomain[0]) {
    localDomain = localDomain.reverse();
    localRange = localRange.reverse();
  }

  while (i < j) {
    d[i] = deinterpolate(localDomain[i], localDomain[i + 1]);
    r[i] = reinterpolate(localRange[i], localRange[i + 1]);
    i += 1;
  }

  return (x) => {
    const k = bisect(domain, x, 1, j) - 1;

    return r[k](d[k](x));
  };
}

class ScaleContinuous {
  constructor (deinterpolate, reinterpolate) {
    this.deinterpolate = deinterpolate;
    this.reinterpolate = reinterpolate;

    this.domain = UNIT;
    this.range = UNIT;
    this.interpolate = interpolateValue;
    this.willClamp = false;

    this.input = null;
    this.output = null;

    this.rescale();
  }

  rescale () {
    this.piecewise = Math.min(this.domain.length, this.range.length) > 2 ? polymap : bimap;

    this.input = null;
    this.output = null;

    return this;
  }

  setDomain (domain = UNIT) {
    this.domain = domain.map(Number);

    return this.rescale();
  }
  getDomain () {
    return this.domain.slice();
  }

  setRange (range = UNIT) {
    this.range = range.slice();

    return this.rescale();
  }
  getRange () {
    return this.range.slice();
  }

  setInterpolator (interpolator = interpolateValue) {
    this.interpolate = interpolator;

    return this.rescale();
  }
  getInterpolator () {
    return this.interpolate;
  }

  rangeRound (range = UNIT) {
    this.range = range.slice();
    this.interpolate = interpolateRound;

    return this.rescale();
  }

  setClamp (willClamp = false) {
    this.willClamp = Boolean(willClamp);

    return this.rescale();
  }
  getClamp () {
    return this.willClamp;
  }

  getRangeForDomain (domainElement) {
    const deinterpolate = this.willClamp
      ? deinterpolateClamp(this.deinterpolate)
      : this.deinterpolate;

    if (!this.output) {
      this.output = this.piecewise(this.domain, this.range, deinterpolate, this.interpolate);
    }

    return this.output(Number(domainElement));
  }
  getDomainForRange (rangeElement) {
    const reinterpolate = this.willClamp
      ? reinterpolateClamp(this.reinterpolate)
      : this.reinterpolate;

    if (!this.input) {
      this.input = this.piecewise(this.range, this.domain, deinterpolateLinear, reinterpolate);
    }

    return this.input(Number(rangeElement));
  }
}

export { deinterpolateLinear, copyScale };
export default ScaleContinuous;
