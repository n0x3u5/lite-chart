import SVG from 'svg.js';
import data from './data';
import ScaleBand from './scales/band';
import ScaleLinear from './scales/linear';
import ScalePoint from './scales/point';
import { AxisLeft, AxisBottom } from './axes/axis';

const margin = {
        top: 30,
        right: 20,
        bottom: 20,
        left: 30
      },
      svgWidth = 960,
      svgHeight = 500,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom,
      painter = SVG('container').size(svgWidth, svgHeight)
        .group()
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .addClass('chart'),
      bandScale = new ScaleBand()
        .setDomain(data.map(datum => datum.x))
        .setRange([0, width])
        .setPadding(0.25),
      pointScale = new ScalePoint()
        .setDomain(data.map(datum => datum.x))
        .setRange([0 + (bandScale.getBandwidth() / 2), width - (bandScale.getBandwidth() / 2)])
        .setPadding(0.25),
      linearScale = new ScaleLinear()
        .setDomain([
          Math.min(0, data.map(datum => datum.y).reduce((a, b) => Math.min(a, b))),
          data.map(datum => datum.y).reduce((a, b) => Math.max(a, b))
        ])
        .setRange([height, 0])
        .nice(),
      hAxis = new AxisBottom(bandScale),
      vAxis = new AxisLeft(linearScale)
        .setTickSizeOuter(0);

painter.path()
  .addClass('area-plot')
  .attr({
    stroke: '#000000',
    'stroke-width': 4,
    'stroke-linejoin': 'round',
    'fill-opacity': 0.8,
    fill: '#F5C8AF'
  })
  .plot(data.reduce((acc, datum, idx, arr) => {
    const path = `${acc} ${pointScale.getRangeForDomain(datum.x)} ${linearScale.getRangeForDomain(datum.y)}`;

    if (idx === arr.length - 1) {
      return `${path} L ${pointScale.getRangeForDomain(datum.x)} ${linearScale.getRangeForDomain(linearScale.getDomain()[0])}`;
    }

    return `${path} L`;
  }, `M ${pointScale.getRangeForDomain(data[0].x)} ${linearScale.getRangeForDomain(linearScale.getDomain()[0])}`));

data.map(datum =>
  painter.rect()
    .addClass('bar-plot')
    .attr({
      x: bandScale.getRangeForDomain(datum.x),
      y: linearScale.getRangeForDomain(datum.y),
      width: bandScale.getBandwidth(),
      height: height - linearScale.getRangeForDomain(datum.y),
      fill: datum.color
    })
    .style('shape-rendering', 'crisp-edges'));

painter.path()
  .addClass('line-plot')
  .attr({
    stroke: '#000000',
    'stroke-width': 4,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    fill: 'none'
  })
  .plot(data.reduce((acc, datum, idx, arr) => {
    const path = `${acc} ${pointScale.getRangeForDomain(datum.x)} ${linearScale.getRangeForDomain(datum.y)}`;

    if (idx === 0) {
      return `M ${path}`;
    }

    if (idx === arr.length - 1) {
      return `${path}`;
    }

    return `${path} L`;
  }, ''));

data.map(datum =>
  painter.circle().addClass('circle-plot').attr({
    cx: pointScale.getRangeForDomain(datum.x),
    cy: linearScale.getRangeForDomain(datum.y),
    r: 4,
    fill: '#ffffff',
    'stroke-width': 2,
    stroke: datum.color
  }));

hAxis.draw(painter);
vAxis.draw(painter);

hAxis.container.attr('transform', `translate(0, ${height})`);
