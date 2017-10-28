import SmartLabel from 'fusioncharts-smartlabel';
import ScaleBand from './scales/band';
import ScaleLinear from './scales/linear';
import data from './data';

const SVG_NS = 'http://www.w3.org/2000/svg',
      top = 10,
      left = 60,
      height = 290,
      width = 680,
      bottom = top + height,
      right = left + width,
      tickLength = 5,
      fontSize = 12,
      minBandHeight = 1,
      sl = new SmartLabel('lc-sl').setStyle({
        'font-size': '12px',
        'font-family': 'Helvetica, Arial, sans-serif',
        'font-weight': 'normal',
        'font-style': 'normal'
      }),
      xBandScale = new ScaleBand()
        .setDomain(data.map(datum => datum.x))
        .setRange([left, right])
        .setPadding(0.25),
      yRange = [minBandHeight, height],
      yLinearScale = new ScaleLinear()
        .setDomain([
          Math.min(0, data.map(datum => datum.y).reduce((a, b) => Math.min(a, b))),
          data.map(datum => datum.y).reduce((a, b) => Math.max(a, b)) + 1
        ])
        .setRange(yRange)
        .nice(),
      ticks = yLinearScale.ticks().map((tick) => {
        const ob = sl.getOriSize(tick.toString());
        ob.text = tick;
        return ob;
      }),
      tickIncrement = yLinearScale.getRangeForDomain(ticks[1].text) -
        yLinearScale.getRangeForDomain(ticks[0].text),
      svg = document.createElementNS(SVG_NS, 'svg'),
      bandWidth = xBandScale.getBandwidth(),
      halfBandwidth = bandWidth / 2;

svg.setAttribute('width', 800);
svg.setAttribute('height', 400);

ticks.map((tick) => {
  const tickElem = document.createElementNS(SVG_NS, 'line'),
        yPos = bottom - yLinearScale.getRangeForDomain(tick.text),
        fill = '#000000';

  tickElem.setAttribute('x1', left - tickLength);
  tickElem.setAttribute('y1', yPos);
  tickElem.setAttribute('x2', right);
  tickElem.setAttribute('y2', yPos);
  tickElem.setAttribute('stroke', fill);
  tickElem.setAttribute('opacity', tick.text === 0 ? 1 : 0.2);

  svg.appendChild(tickElem);

  return tickElem;
});

ticks.map((tick, i) => {
  const tickElem = document.createElementNS(SVG_NS, 'rect'),
        yPos = bottom - yLinearScale.getRangeForDomain(tick.text),
        fill = '#000000';

  if (yLinearScale.getDomainForRange(0) < yLinearScale.getDomainForRange(1)) {
    if (i % 2 !== 0) {
      tickElem.setAttribute('x', left);
      tickElem.setAttribute('y', yPos);
      tickElem.setAttribute('width', right - left);
      tickElem.setAttribute('height', Math.abs(tickIncrement));
      tickElem.setAttribute('stroke', fill);
      tickElem.setAttribute('opacity', 0.1);

      svg.appendChild(tickElem);
    }
  } else if (i % 2 === 0) {
    tickElem.setAttribute('x', left);
    tickElem.setAttribute('y', yPos);
    tickElem.setAttribute('width', right - left);
    tickElem.setAttribute('height', Math.abs(tickIncrement));
    tickElem.setAttribute('stroke', fill);
    tickElem.setAttribute('opacity', 0.1);

    svg.appendChild(tickElem);
  }

  return tickElem;
});

data.map((datum) => {
  const domainMin = yLinearScale.getDomain()[0],
        plotHeight = yLinearScale.getRangeForDomain(datum.y) -
          yLinearScale.getRangeForDomain(domainMin),
        plotWidth = bandWidth < 1 ? 1 : bandWidth,
        isReverse = yLinearScale.getDomainForRange(0) > yLinearScale.getDomainForRange(1),
        xPos = xBandScale.getRangeForDomain(datum.x),
        yPos = datum.y < domainMin
          ? bottom - yLinearScale.getRangeForDomain(isReverse ? datum.y : domainMin)
          : bottom - yLinearScale.getRangeForDomain(isReverse ? domainMin : datum.y),
        fill = datum.color,
        band = document.createElementNS(SVG_NS, 'rect');

  band.setAttribute('x', xPos);
  band.setAttribute('y', yPos);
  band.setAttribute('width', plotWidth);
  band.setAttribute('height', Math.abs(plotHeight));
  band.setAttribute('fill', fill);

  svg.appendChild(band);

  return band;
});

data.map((datum) => {
  const xPos = xBandScale.getRangeForDomain(datum.x) + halfBandwidth,
        tickElem = document.createElementNS(SVG_NS, 'line');

  tickElem.setAttribute('x1', xPos);
  tickElem.setAttribute('y1', bottom);
  tickElem.setAttribute('x2', xPos);
  tickElem.setAttribute('y2', bottom + tickLength);
  tickElem.setAttribute('stroke', '#000000');

  svg.appendChild(tickElem);

  return tickElem;
});

data.map((datum) => {
  const labelElem = document.createElementNS(SVG_NS, 'text'),
        text = datum.x.split('#FC')[0],
        textDimensions = sl.getOriSize(text),
        xPos = (xBandScale.getRangeForDomain(datum.x) + halfBandwidth),
        yPos = bottom + textDimensions.height;

  labelElem.setAttribute('x', xPos);
  labelElem.setAttribute('y', yPos);
  labelElem.setAttribute('dominant-baseline', 'central');
  labelElem.setAttribute('text-anchor', 'middle');
  labelElem.setAttribute('transform', `rotate(0,${xPos},${yPos})`);
  labelElem.setAttribute('font-size', `${fontSize}px`);
  labelElem.setAttribute('font-family', 'Helvetica, Arial, sans-serif');
  labelElem.innerHTML = text;

  svg.appendChild(labelElem);

  return labelElem;
});

ticks.map((tick) => {
  const labelElem = document.createElementNS(SVG_NS, 'text'),
        xPos = left - tick.width - tickLength - 2,
        yPos = bottom - yLinearScale.getRangeForDomain(tick.text);

  labelElem.setAttribute('x', xPos);
  labelElem.setAttribute('y', yPos);
  labelElem.setAttribute('dominant-baseline', 'central');
  labelElem.setAttribute('text-anchor', 'right');
  labelElem.setAttribute('font-size', `${fontSize}px`);
  labelElem.setAttribute('font-family', 'Helvetica, Arial, sans-serif');
  labelElem.innerHTML = tick.text.toString();

  svg.appendChild(labelElem);

  return labelElem;
});

const trendLine = document.createElementNS(SVG_NS, 'line'),
      trendY = yLinearScale.getRangeForDomain(7);

trendLine.setAttribute('x1', left);
trendLine.setAttribute('y1', bottom - trendY);
trendLine.setAttribute('x2', right);
trendLine.setAttribute('y2', bottom - trendY);
trendLine.setAttribute('stroke', '#30ef00');

svg.appendChild(trendLine);

const trendLabel = document.createElementNS(SVG_NS, 'text');

trendLabel.setAttribute('x', right + 2);
trendLabel.setAttribute('y', bottom - trendY);
trendLabel.setAttribute('fill', '#30ef00');
trendLabel.setAttribute('dominant-baseline', 'central');
trendLabel.setAttribute('text-anchor', 'right');
trendLabel.setAttribute('font-size', `${fontSize}px`);
trendLabel.setAttribute('font-family', 'Helvetica, Arial, sans-serif');
trendLabel.innerHTML = 'Here be 7';

svg.appendChild(trendLabel);

const horizontalLine = document.createElementNS(SVG_NS, 'line');

horizontalLine.setAttribute('x1', left);
horizontalLine.setAttribute('y1', bottom - yLinearScale.getRangeForDomain(0));
horizontalLine.setAttribute('x2', right);
horizontalLine.setAttribute('y2', bottom - yLinearScale.getRangeForDomain(0));
horizontalLine.setAttribute('stroke', '#000000');

svg.appendChild(horizontalLine);

const verticalLine = document.createElementNS(SVG_NS, 'line');

verticalLine.setAttribute('x1', left);
verticalLine.setAttribute('y1', bottom - height);
verticalLine.setAttribute('x2', left);
verticalLine.setAttribute('y2', bottom);
verticalLine.setAttribute('stroke', '#000000');

svg.appendChild(verticalLine);

document.getElementById('container').appendChild(svg);
