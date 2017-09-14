import scaleOrdinal from 'd3-scale/src/ordinal';
import zipObj from 'ramda/src/zipObj';

const tenPow = num => num ** 10,
      toPrecision = (num, precision) => Math.round(num * tenPow(precision)) / tenPow(precision),
      range = ['A', 'B', 'C', 'D', 'E', 'F'],
      rangePadding = 0.5,
      domainStart = 29,
      domainEnd = 625,
      precision = 2,
      domainSpan = Math.abs(domainEnd - domainStart),
      domainInterval = domainSpan / (range.length - 1),
      paddedDomainStart = domainStart + (domainInterval * rangePadding),
      // paddedDomainEnd = domainEnd - (domainInterval * rangePadding),
      getDomain = (v, i) => toPrecision(paddedDomainStart + (i * domainInterval), precision),
      domain = range.map(getDomain),
      ordinalScale = scaleOrdinal()
        .range(range)
        .domain(domain);

console.log(zipObj(ordinalScale.range(), ordinalScale.domain()));
