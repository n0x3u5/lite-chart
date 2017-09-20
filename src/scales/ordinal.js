class ScaleOrdinal {
  constructor () {
    this.config = {
      map: new Map()
    };

    this.setDomain();
    this.setRange();
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
        this.config.map.set(key, domainElement);
        this.config.domain.push(domainElement);
      }

      idx += 1;
    }

    return this;
  }
  getDomain () {
    return this.config.domain;
  }

  setRange (range = []) {
    this.config.range = range.slice();

    return this;
  }
  getRange () {
    return this.config.range;
  }

  getRangeForDomain (domainElement) {
    const key = domainElement.toString(),
          { domain } = this.config;

    let val;

    if (this.config.map.has(key)) {
      val = this.config.map.get(key);
    } else {
      val = domain.push(domainElement);
      this.config.map.set(key, val);
    }

    return this.config.range[(val - 1) % this.config.range.length];
  }

  getDomainForRange (rangeElement) {
    return this.config.domain[this.config.range.findIndex(rangeElement)];
  }
}

export default ScaleOrdinal;
