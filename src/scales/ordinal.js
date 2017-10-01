const DEFAULT_UNKNOWN = 'implicit';

class ScaleOrdinal {
  constructor () {
    this.config = {
      map: new Map()
    };

    this.config.unknown = DEFAULT_UNKNOWN;
    this.config.domain = [];
    this.config.ordinalRange = [];
  }

  setDomain (domain = []) {
    const domainLength = domain.length;
    let key,
        idx = 0,
        domainElement;

    this.config.domain = [];
    this.config.map = new Map();

    while (idx < domainLength) {
      domainElement = domain[idx];
      key = domainElement.toString();

      if (!this.config.map.has(key)) {
        this.config.map.set(key, this.config.domain.push(domainElement));
      }

      idx += 1;
    }

    return this;
  }
  getDomain () {
    return this.config.domain.slice();
  }

  setRange (range = []) {
    this.config.ordinalRange = range.slice();

    return this;
  }
  getRange () {
    return this.config.ordinalRange.slice();
  }

  setUnknown (unknown) {
    this.config.unknown = unknown;

    return this;
  }
  getUnknown () {
    return this.config.unknown;
  }

  getRangeForDomain (domainElement) {
    const key = domainElement.toString(),
          { map } = this.config;

    let val = map.get(key);

    if (!val) {
      if (this.getUnknown() !== DEFAULT_UNKNOWN) {
        return this.getUnknown();
      }
      val = this.config.domain.push(domainElement);
      map.set(key, val);
    }

    return this.config.ordinalRange[(val - 1) % this.config.ordinalRange.length];
  }

  copy () {
    return new ScaleOrdinal()
      .setDomain(this.config.domain)
      .setRange(this.config.ordinalRange)
      .setUnknown(this.config.unknown);
  }
}

export default ScaleOrdinal;
