import SVG from 'svg.js';

import Axis from './axes/axis';
import ScaleOrdinal from './scales/ordinal';

const tenPow = num => num ** 10,
      toPrecision = (num, precision = 2) => Math.round(num * tenPow(precision)) / tenPow(precision),
      width = '100%',
      height = '100%',
      yRange = ['A', 'B', 'C', 'D', 'E', 'F'],
      xRange = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      // Prepping Y Axis scale for consumption by axis
      yDomainStart = 20,
      yDomainEnd = 105,
      yDomainSpan = Math.abs(yDomainEnd - yDomainStart),
      yDomainInterval = yDomainSpan / (yRange.length - 1),
      getYDomain = (v, i) => toPrecision(yDomainStart + (i * yDomainInterval)),
      yDomain = yRange.map(getYDomain),
      yOrdinalScale = new ScaleOrdinal()
        .setRange(yRange)
        .setDomain(yDomain),
      ordinalYAxis = new Axis(),
      // Prepping X Axis scale for consumption by axis
      xDomainStart = 75,
      xDomainEnd = 600,
      xDomainSpan = Math.abs(xDomainEnd - xDomainStart),
      xDomainInterval = xDomainSpan / (xRange.length - 1),
      getXDomain = (v, i) => toPrecision(xDomainStart + (i * xDomainInterval)),
      xDomain = xRange.map(getXDomain),
      xOrdinalScale = new ScaleOrdinal()
        .setRange(xRange)
        .setDomain(xDomain),
      ordinalXAxis = new Axis(),
      painter = SVG('container').size(width, height);

ordinalYAxis.setOrientation('left');
ordinalYAxis.setScale(yOrdinalScale);
ordinalYAxis.setPainter(painter);
ordinalYAxis.draw();

ordinalXAxis.setValuePadding(0.5);
ordinalXAxis.setScale(xOrdinalScale);
ordinalXAxis.setPainter(painter);
ordinalXAxis.draw();
