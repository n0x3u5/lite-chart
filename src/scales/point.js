import ScaleBand from './band';

class ScalePoint extends ScaleBand {
  constructor () {
    super();

    this.config.paddingInner = 1;
  }

  setPadding (outerPadding = 0) {
    this.config.paddingOuter = Math.max(0, Math.min(1, outerPadding));

    return this.rescale();
  }
  getPadding () {
    return this.config.paddingOuter;
  }

  setPaddingInner () {
    return this;
  }

  setPaddingOuter () {
    return this;
  }

  copy () {
    return new ScalePoint()
      .setDomain(this.config.domain)
      .setRange(this.config.bandRange)
      .setRound(this.config.round)
      .setPadding(this.config.paddingOuter)
      .setAlignment(this.config.alignment);
  }
}

export default ScalePoint;
