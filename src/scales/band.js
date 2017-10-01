import ScaleOrdinal from './ordinal';
import sequence from '../utils/range';

class ScaleBand extends ScaleOrdinal {
  constructor () {
    super();
    this.config.unknown = undefined;
    this.config.bandRange = [0, 1];
    this.config.round = false;
    this.config.paddingInner = 0;
    this.config.paddingOuter = 0;
    this.config.alignment = 0.5;

    this.rescale();
  }

  rescale () {
    const n = this.getDomain().length,
          range = this.getRange(),
          isReverse = range[1] < range[0],
          stop = range[1 - Number(isReverse)],
          availableSpace = (n - this.getPaddingInner()) + (this.getPaddingOuter() * 2);

    let start = range[Number(isReverse) - 0];

    const interval = stop - start;

    this.config.step = interval / Math.max(1, availableSpace);

    if (this.getRound()) {
      this.config.step = Math.floor(this.getStep());
    }

    start += (interval - (this.getStep() * (n - this.getPaddingInner()))) * this.getAlignment();

    this.config.bandwidth = this.getStep() * (1 - this.getPaddingInner());

    if (this.getRound()) {
      start = Math.round(start);
      this.config.bandwidth = Math.round(this.getBandwidth());
    }

    const values = sequence(n).map(i => start + (this.getStep() * i));

    return values.length > 0 ? super.setRange(isReverse ? values.reverse() : values) : this;
  }

  setDomain (domain = []) {
    super.setDomain(domain);
    return this.rescale();
  }

  setRange (range = [0, 1]) {
    this.config.bandRange = [Number(range[0]), Number(range[range.length - 1])];
    return this.rescale();
  }
  getRange () {
    return this.config.bandRange.slice();
  }

  getBandwidth () {
    return this.config.bandwidth;
  }

  getStep () {
    return this.config.step;
  }

  setRound (willRound = false) {
    this.config.round = !!willRound;
    return this.rescale();
  }
  getRound () {
    return this.config.round;
  }

  setUnknown () {
    return this;
  }

  setPadding (padding = 0) {
    this.config.paddingInner = Math.max(0, Math.min(1, padding));
    this.config.paddingOuter = Math.max(0, Math.min(1, padding));
    return this.rescale();
  }
  getPadding () {
    return this.getPaddingInner();
  }

  setPaddingInner (innerPadding = 0) {
    this.config.paddingInner = Math.max(0, Math.min(1, innerPadding));
    return this.rescale();
  }
  getPaddingInner () {
    return this.config.paddingInner;
  }

  setPaddingOuter (outerPadding = 0) {
    this.config.paddingOuter = Math.max(0, Math.min(1, outerPadding));
    return this.rescale();
  }
  getPaddingOuter () {
    return this.config.paddingOuter;
  }

  setAlignment (alignment = 0.5) {
    this.config.alignment = Math.max(0, Math.min(1, alignment));
    return this.rescale();
  }
  getAlignment () {
    return this.config.alignment;
  }

  rangeRound (range) {
    this.config.bandRange = [Number(range[0]), Number(range[range.length - 1])];
    this.config.round = true;

    return this.rescale();
  }

  copy () {
    return new ScaleBand()
      .setDomain(this.config.domain)
      .setRange(this.config.bandRange)
      .setRound(this.config.round)
      .setPaddingInner(this.config.paddingInner)
      .setPaddingOuter(this.config.paddingOuter)
      .setAlignment(this.config.alignment);
  }
}

export default ScaleBand;
