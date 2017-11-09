import SVG from 'svg.js';
// import data from './data';
// import ScaleBand from './scales/band';
// import ScaleLinear from './scales/linear';
// import ScalePoint from './scales/point';
import ScaleTime from './scales/time';
import { AxisBottom } from './axes/axis';

const margin = {
        top: 30,
        right: 50,
        bottom: 20,
        left: 100
      },
      svgWidth = 960,
      svgHeight = 500,
      width = svgWidth - margin.left - margin.right,
      // height = svgHeight - margin.top - margin.bottom,
      painter = SVG('container').size(svgWidth, svgHeight)
        .group()
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .addClass('chart'),
      timeScale = new ScaleTime()
        .setRange([0, width])
        .setDomain([new Date(2013, 0, 1, 12, 0, 0, 0),
          new Date(2013, 0, 1, 12, 0, 0, 128)]),
      hAxis = new AxisBottom(timeScale).setTickSizeOuter(0);

hAxis.draw(painter);
