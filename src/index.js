import SVG from 'svg.js';
import ScaleBand from './scales/band';

const y = 100,
      tickLength = 5,
      bandHeight = 40,
      xDomain = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      xRangeStart = 75,
      xRangeLength = 500,
      xRangeEnd = xRangeStart + xRangeLength,
      xBandScale = new ScaleBand()
        .setDomain(xDomain)
        .setRange([xRangeStart, xRangeEnd])
        .setRound(true)
        .setPadding(0.5),
      painter = SVG('container').size('100%', '100%'),
      bandWidth = xBandScale.getBandwidth(),
      halfBandwidth = bandWidth / 2;

painter.line(xRangeStart, y, xRangeEnd, y).attr({
  'stroke-width': 1
});

xDomain.map(el =>
  painter.rect(bandWidth, bandHeight).attr({
    x: xBandScale.getRangeForDomain(el),
    y: y - bandHeight
  }));

xDomain.map(el =>
  painter.line(
    xBandScale.getRangeForDomain(el) + halfBandwidth,
    y,
    xBandScale.getRangeForDomain(el) + halfBandwidth,
    y + tickLength
  ).attr({
    'stroke-width': 1
  }));

xDomain.map(el =>
  painter.text(el).attr({
    x: xBandScale.getRangeForDomain(el),
    y,
    'font-size': '12px'
  }));
