import { AxisLeft } from '../axis';
import ScaleLinear from '../../scales/linear';
import axisSVGString from './axis_svg';

const window = require('svgdom'),
      SVG = require('svg.js')(window),
      { document } = window,
      painter = SVG(document.documentElement).size(960, 500);

describe('An axis should', () => {
  describe('by default', () => {
    const scale = new ScaleLinear(),
          axis = new AxisLeft(scale);

    test('have its scale set correctly', () => {
      expect(axis.getScale()).toBe(scale);
      expect(axis.getTickArguments()).toEqual([]);
      expect(axis.getTickValues()).toBeNull();
      expect(axis.getTickSize()).toBe(6);
      expect(axis.getTickSizeInner()).toBe(6);
      expect(axis.getTickSizeOuter()).toBe(6);
      expect(axis.getTickPadding()).toBe(3);
    });
  });

  test('be able to set the tick arguments', () => {
    const axis = new AxisLeft(new ScaleLinear()).ticks(20);

    expect(axis.getTickArguments()).toEqual([20]);
    axis.ticks();
    expect(axis.getTickArguments()).toEqual([]);
  });

  test('reset the tick arguments to an empty array when null is set', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickArguments(null);

    expect(axis.getTickArguments()).toEqual([]);
  });

  test('reset the tick arguments to an empty array when null is set', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickArguments(null);

    expect(axis.getTickArguments()).toEqual([]);
  });

  test('make a copy of the input tick arguments', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickArguments([20]),
          tickArgs = axis.getTickArguments();

    tickArgs.push(10);
    expect(axis.getTickArguments()).toEqual([20]);
  });

  test('clear any explicitly set tick values when null is set', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickValues([1, 2, 3]);

    expect(axis.getTickValues()).toEqual([1, 2, 3]);
    axis.setTickValues([]);
    expect(axis.getTickValues()).toEqual([]);
    axis.setTickValues(null);
    expect(axis.getTickValues()).toBeNull();
  });

  test('be able to set tick values explicitly', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickValues([1, 2, 3]);
    expect(axis.getTickValues()).toEqual([1, 2, 3]);
  });

  test('make a copy of the input tick values', () => {
    const ticks = [1, 2, 3],
          axis = new AxisLeft(new ScaleLinear()).setTickValues(ticks);

    ticks.push(4);
    expect(axis.getTickValues()).toEqual([1, 2, 3]);
  });

  test('return a copy of its tick values', () => {
    const axis = new AxisLeft(new ScaleLinear()).setTickValues([1, 2, 3]),
          ticks = axis.getTickValues();
    ticks.push(4);
    expect(axis.getTickValues()).toEqual([1, 2, 3]);
  });

  test('create the correct visual for a left aligned axis with a continuous numeric scale', () => {
    const axis = new AxisLeft(new ScaleLinear().setDomain([3, 10]).setRange([0, 10]));
    axis.draw(painter);
    expect(painter.svg()).toEqual(axisSVGString);
  });
});
