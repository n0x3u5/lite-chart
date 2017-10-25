import ScaleLinear from '../linear';
import round from './roundEpsilon';

const ticks = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      reverseTicks = ticks.slice().reverse(),
      posToNegTicks = [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -100],
      negToPosTicks = posToNegTicks.slice().reverse();

describe('A linear scale should', () => {
  describe('by default', () => {
    const linearScale = new ScaleLinear();

    test('have unit domain', () => {
      expect(linearScale.getDomain()).toEqual([0, 1]);
    });

    test('have unit range', () => {
      expect(linearScale.getRange()).toEqual([0, 1]);
    });

    test('to not have clamp set', () => {
      expect(linearScale.getClamp()).toBeFalsy();
    });

    test('to interpolate numbers correctly', () => {
      const interpolate = linearScale.getInterpolator()(1, 2);
      expect(interpolate(0.5)).toBe(1.5);
    });
  });

  test('map a domain value to its range value', () => {
    const linearScale = new ScaleLinear();

    linearScale.setRange([1, 4]);

    expect(linearScale.getRangeForDomain(0.5)).toBe(2.5);
  });

  test('ignore extra range values if the domain is smaller than the range', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([-10, 0]);
    linearScale.setRange([0, 1, 2]);
    linearScale.setClamp(true);

    expect(linearScale.getRangeForDomain(-5)).toBe(0.5);
    expect(linearScale.getRangeForDomain(50)).toBe(1);
  });

  test('ignore extra domain values if the range is smaller than the domain', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([-10, 0, 100]);
    linearScale.setRange([6, 7]);
    linearScale.setClamp(true);

    expect(linearScale.getRangeForDomain(-5)).toBe(6.5);
    expect(linearScale.getRangeForDomain(50)).toBe(7);
  });

  test('map an empty domain to the start of the range', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([0, 0]);

    linearScale.setRange([1, 2]);
    expect(linearScale.getRangeForDomain(0)).toBe(1);

    linearScale.setRange([2, 1]);
    expect(linearScale.getRangeForDomain(1)).toBe(2);
  });

  test('map a bilinear domain with two values to the corresponding range', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([1, 2]);

    expect(linearScale.getDomain()).toEqual([1, 2]);

    expect(linearScale.getRangeForDomain(0.5)).toBe(-0.5);
    expect(linearScale.getRangeForDomain(1.0)).toBe(0.0);
    expect(linearScale.getRangeForDomain(1.5)).toBe(0.5);
    expect(linearScale.getRangeForDomain(2.0)).toBe(1.0);
    expect(linearScale.getRangeForDomain(2.5)).toBe(1.5);

    expect(linearScale.getDomainForRange(-0.5)).toBe(0.5);
    expect(linearScale.getDomainForRange(0.0)).toBe(1.0);
    expect(linearScale.getDomainForRange(0.5)).toBe(1.5);
    expect(linearScale.getDomainForRange(1.0)).toBe(2.0);
    expect(linearScale.getDomainForRange(1.5)).toBe(2.5);
  });

  test('map a polylinear domain with more than two values to the corresponding range', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([-10, 0, 100]);
    linearScale.setRange([100, 400, 500]);

    expect(linearScale.getDomain()).toEqual([-10, 0, 100]);

    expect(linearScale.getRangeForDomain(-5)).toBe(250);
    expect(linearScale.getRangeForDomain(50)).toBe(450);
    expect(linearScale.getRangeForDomain(75)).toBe(475);

    linearScale.setDomain([4, 2, 1]);
    linearScale.setRange([1, 2, 4]);

    expect(linearScale.getRangeForDomain(1.5)).toBe(3);
    expect(linearScale.getRangeForDomain(3)).toBe(1.5);
    expect(linearScale.getDomainForRange(1.5)).toBe(3);
    expect(linearScale.getDomainForRange(3)).toBe(1.5);

    linearScale.setDomain([1, 2, 4]);
    linearScale.setRange([4, 2, 1]);

    expect(linearScale.getRangeForDomain(1.5)).toBe(3);
    expect(linearScale.getRangeForDomain(3)).toBe(1.5);
    expect(linearScale.getDomainForRange(1.5)).toBe(3);
    expect(linearScale.getDomainForRange(3)).toBe(1.5);
  });

  test('map a range value to a domain value', () => {
    const linearScale = new ScaleLinear();

    linearScale.setRange([1, 2]);

    expect(linearScale.getDomainForRange(1.5)).toBe(0.5);
  });

  test('map an empty range to the start of the domain', () => {
    const linearScale = new ScaleLinear();

    linearScale.setRange([0, 0]);

    linearScale.setDomain([1, 2]);
    expect(linearScale.getDomainForRange(0)).toBe(1);

    linearScale.setDomain([2, 1]);
    expect(linearScale.getDomainForRange(1)).toBe(2);
  });

  test('coerce range values to numbers', () => {
    const linearScale = new ScaleLinear();

    linearScale.setRange(['0', '2']);
    expect(linearScale.getDomainForRange('1')).toBe(0.5);

    linearScale.setRange([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
    expect(+linearScale.getDomainForRange(new Date(1990, 6, 2, 13)).toFixed(1)).toBe(0.5);
  });

  test('return NaN if the range is not coercible to number', () => {
    const linearScale = new ScaleLinear();

    linearScale.setRange(['xyz', 'abc']);

    expect(linearScale.getDomainForRange('uvw')).toBeNaN();
    expect(linearScale.getDomainForRange('tuv')).toBeNaN();
  });

  test('accept an array of numbers as its domain', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([]);
    expect(linearScale.getDomain()).toEqual([]);

    linearScale.setDomain([1, 0]);
    expect(linearScale.getDomain()).toEqual([1, 0]);

    linearScale.setDomain([1, 2, 3]);
    expect(linearScale.getDomain()).toEqual([1, 2, 3]);
  });

  test('coerce domain values to numbers', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
    expect(linearScale.getDomain()).toEqual([631132200000, 662668200000]);

    linearScale.setDomain(['0.0', '1.0']);
    expect(linearScale.getDomain()).toEqual([0, 1]);

    // eslint-disable-next-line
    linearScale.setDomain([new Number(0), new Number(1)]);
    expect(linearScale.getDomain()).toEqual([0, 1]);
  });

  test('create a copy the input domain', () => {
    const domain = [1, 2],
          linearScale = new ScaleLinear().setDomain(domain);

    expect(linearScale.getDomain()).toEqual([1, 2]);

    domain.push(3);

    expect(linearScale.getDomain()).toEqual([1, 2]);
    expect(domain).toEqual([1, 2, 3]);
  });

  test('return a copy of its domain', () => {
    const linearScale = new ScaleLinear(),
          domain = linearScale.getDomain();

    expect(domain).toEqual([0, 1]);

    domain.push(3);

    expect(linearScale.getDomain()).toEqual([0, 1]);
  });

  test.skip('not coerce range to numbers', () => {
    // TODO: This will be skipped until string interpolator is supported by the continuous scale
    const linearScale = new ScaleLinear();

    linearScale.setRange(['0px', '2px']);

    expect(linearScale.getRange()).toEqual(['0px', '2px']);
    expect(linearScale.getRangeForDomain(0.5)).toBe('1px');
  });

  test('make a copy of the input range', () => {
    const range = [1, 2],
          linearScale = new ScaleLinear().setRange(range);

    expect(linearScale.getRange()).toEqual([1, 2]);

    range.push(3);
    expect(linearScale.getRange()).toEqual([1, 2]);
    expect(range).toEqual([1, 2, 3]);
  });

  test('return a copy of its range', () => {
    const linearScale = new ScaleLinear(),
          range = linearScale.getRange();

    expect(range).toEqual([0, 1]);

    range.push(3);
    expect(linearScale.getRange()).toEqual([0, 1]);
  });

  test('allow a shorthand to set the range and round them off', () => {
    const linearScale = new ScaleLinear();

    linearScale.rangeRound([0, 10]);

    expect(linearScale.getRangeForDomain(0.59)).toBe(6);
  });

  test('not clamp the output by default', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.getClamp()).toBeFalsy();
    expect(linearScale.setRange([10, 20]).getRangeForDomain(2)).toBe(30);
    expect(linearScale.setRange([10, 20]).getRangeForDomain(-1)).toBe(0);
    expect(linearScale.setRange([10, 20]).getDomainForRange(30)).toBe(2);
    expect(linearScale.setRange([10, 20]).getDomainForRange(0)).toBe(-1);
  });

  test('be able to clamp output values to the range', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setClamp(true).setRange([10, 20]).getRangeForDomain(2)).toBe(20);
    expect(linearScale.setClamp(true).setRange([10, 20]).getRangeForDomain(-1)).toBe(10);
  });

  test('be able to clamp input values to the domain', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setClamp(true).setRange([10, 20]).getDomainForRange(30)).toBe(1);
    expect(linearScale.setClamp(true).setRange([10, 20]).getDomainForRange(0)).toBe(0);
  });

  test('coerce the input clamp value to a boolean', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setClamp('true').getClamp()).toBeTruthy();
    expect(linearScale.setClamp(1).getClamp()).toBeTruthy();
    expect(linearScale.setClamp('').getClamp()).toBeFalsy();
    expect(linearScale.setClamp(0).getClamp()).toBeFalsy();
  });

  test('accept a custom interpolator', () => {
    const interpolate = (a, b) => t => [a, b, t],
          linearScale = new ScaleLinear();

    linearScale.setDomain([10, 20]).setRange(['a', 'b']).setInterpolator(interpolate);

    expect(linearScale.getInterpolator()).toEqual(interpolate);
    expect(linearScale.getRangeForDomain(15)).toEqual(['a', 'b', 0.5]);
  });

  test('return nice domain values when asked', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setDomain([0, 0.96]).nice().getDomain()).toEqual([0, 1]);
    expect(linearScale.setDomain([0, 96]).nice().getDomain()).toEqual([0, 100]);
  });

  test('extend the domain to match the desired ticks when niced', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setDomain([0, 0.96]).nice(10).getDomain()).toEqual([0, 1]);
    expect(linearScale.setDomain([0, 96]).nice(10).getDomain()).toEqual([0, 100]);
    expect(linearScale.setDomain([0.96, 0]).nice(10).getDomain()).toEqual([1, 0]);
    expect(linearScale.setDomain([96, 0]).nice(10).getDomain()).toEqual([100, 0]);
    expect(linearScale.setDomain([0, -0.96]).nice(10).getDomain()).toEqual([0, -1]);
    expect(linearScale.setDomain([0, -96]).nice(10).getDomain()).toEqual([0, -100]);
    expect(linearScale.setDomain([-0.96, 0]).nice(10).getDomain()).toEqual([-1, 0]);
    expect(linearScale.setDomain([-96, 0]).nice(10).getDomain()).toEqual([-100, 0]);
    expect(linearScale.setDomain([-0.1, 51.1]).nice(8).getDomain()).toEqual([-10, 60]);
  });

  test('be able to nice the domain, extending it to round numbers', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setDomain([1.1, 10.9]).nice(10).getDomain()).toEqual([1, 11]);
    expect(linearScale.setDomain([10.9, 1.1]).nice(10).getDomain()).toEqual([11, 1]);
    expect(linearScale.setDomain([0.7, 11.001]).nice(10).getDomain()).toEqual([0, 12]);
    expect(linearScale.setDomain([123.1, 6.7]).nice(10).getDomain()).toEqual([130, 0]);
    expect(linearScale.setDomain([0, 0.49]).nice(10).getDomain()).toEqual([0, 0.5]);
    expect(linearScale.setDomain([0, 14.1]).nice(5).getDomain()).toEqual([0, 20]);
    expect(linearScale.setDomain([0, 15]).nice(5).getDomain()).toEqual([0, 20]);
  });

  test('have no nicing effect on un-nicable domains', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setDomain([0, 0]).nice(10).getDomain()).toEqual([0, 0]);
    expect(linearScale.setDomain([0.5, 0.5]).nice(10).getDomain()).toEqual([0.5, 0.5]);
  });

  test('only affect the extremes of a polylinear domain when niced', () => {
    const linearScale = new ScaleLinear();

    linearScale.setDomain([1.1, 1, 2, 3, 10.9]).nice(10);
    expect(linearScale.getDomain()).toEqual([1, 1, 2, 3, 11]);

    linearScale.setDomain([123.1, 1, 2, 3, -0.9]).nice(10);
    expect(linearScale.getDomain()).toEqual([130, 1, 2, 3, -10]);
  });

  test('accept a tick count to control the nice steps', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.setDomain([12, 87]).nice(5).getDomain()).toEqual([0, 100]);
    expect(linearScale.setDomain([12, 87]).nice(10).getDomain()).toEqual([10, 90]);
    expect(linearScale.setDomain([12, 87]).nice(100).getDomain()).toEqual([12, 87]);
  });

  test('return the expected ticks for an ascending domain', () => {
    const s = new ScaleLinear();

    expect(s.ticks(10).map(round)).toEqual(ticks);
    expect(s.ticks(9).map(round)).toEqual(ticks);
    expect(s.ticks(8).map(round)).toEqual(ticks);
    expect(s.ticks(7).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(s.ticks(6).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(s.ticks(5).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(s.ticks(4).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(s.ticks(3).map(round)).toEqual([0.0, 0.5, 1.0]);
    expect(s.ticks(2).map(round)).toEqual([0.0, 0.5, 1.0]);
    expect(s.ticks(1).map(round)).toEqual([0.0, 1.0]);

    s.setDomain([-100, 100]);
    expect(s.ticks(10)).toEqual(negToPosTicks);
    expect(s.ticks(9)).toEqual(negToPosTicks);
    expect(s.ticks(8)).toEqual(negToPosTicks);
    expect(s.ticks(7)).toEqual(negToPosTicks);
    expect(s.ticks(6)).toEqual([-100, -50, 0, 50, 100]);
    expect(s.ticks(5)).toEqual([-100, -50, 0, 50, 100]);
    expect(s.ticks(4)).toEqual([-100, -50, 0, 50, 100]);
    expect(s.ticks(3)).toEqual([-100, -50, 0, 50, 100]);
    expect(s.ticks(2)).toEqual([-100, 0, 100]);
    expect(s.ticks(1)).toEqual([0]);
  });

  test('return the expected ticks for a descending domain', () => {
    const s = new ScaleLinear();

    s.setDomain([1, 0]);
    expect(s.ticks(10).map(round)).toEqual(reverseTicks);
    expect(s.ticks(9).map(round)).toEqual(reverseTicks);
    expect(s.ticks(8).map(round)).toEqual(reverseTicks);
    expect(s.ticks(7).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0].reverse());
    expect(s.ticks(6).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0].reverse());
    expect(s.ticks(5).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0].reverse());
    expect(s.ticks(4).map(round)).toEqual([0.0, 0.2, 0.4, 0.6, 0.8, 1.0].reverse());
    expect(s.ticks(3).map(round)).toEqual([0.0, 0.5, 1.0].reverse());
    expect(s.ticks(2).map(round)).toEqual([0.0, 0.5, 1.0].reverse());
    expect(s.ticks(1).map(round)).toEqual([0.0, 1.0].reverse());

    s.setDomain([100, -100]);
    expect(s.ticks(10)).toEqual(posToNegTicks);
    expect(s.ticks(9)).toEqual(posToNegTicks);
    expect(s.ticks(8)).toEqual(posToNegTicks);
    expect(s.ticks(7)).toEqual(posToNegTicks);
    expect(s.ticks(6)).toEqual([-100, -50, 0, 50, 100].reverse());
    expect(s.ticks(5)).toEqual([-100, -50, 0, 50, 100].reverse());
    expect(s.ticks(4)).toEqual([-100, -50, 0, 50, 100].reverse());
    expect(s.ticks(3)).toEqual([-100, -50, 0, 50, 100].reverse());
    expect(s.ticks(2)).toEqual([-100, 0, 100].reverse());
    expect(s.ticks(1)).toEqual([0].reverse());
  });

  test('return an empty array of ticks if count is not a positive integer', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.ticks(NaN)).toEqual([]);
    expect(linearScale.ticks(0)).toEqual([]);
    expect(linearScale.ticks(-1)).toEqual([]);
    expect(linearScale.ticks(Infinity)).toEqual([]);
  });

  test('return approximately 7 ticks if no count is specified', () => {
    const linearScale = new ScaleLinear();

    expect(linearScale.ticks()).toEqual(linearScale.ticks(7));
  });

  describe('be able to copy itself with changes to its', () => {
    test('domain being isolated from the copy', () => {
      const linearScale = new ScaleLinear();
      let linearScaleCopy = linearScale.copy();

      linearScale.setDomain([1, 2]);
      expect(linearScaleCopy.getDomain()).toEqual([0, 1]);
      expect(linearScale.getRangeForDomain(1)).toBe(0);
      expect(linearScaleCopy.getRangeForDomain(1)).toBe(1);

      linearScaleCopy.setDomain([2, 3]);
      expect(linearScale.getRangeForDomain(2)).toBe(1);
      expect(linearScaleCopy.getRangeForDomain(2)).toBe(0);
      expect(linearScale.getDomain()).toEqual([1, 2]);
      expect(linearScaleCopy.getDomain()).toEqual([2, 3]);

      linearScaleCopy = linearScale.setDomain([1, 1.9]).copy();
      linearScale.nice(5);
      expect(linearScale.getDomain()).toEqual([1, 2]);
      expect(linearScaleCopy.getDomain()).toEqual([1, 1.9]);
    });

    test('range being isolated from the copy', () => {
      const linearScale = new ScaleLinear(),
            linearScaleCopy = linearScale.copy();

      linearScale.setRange([1, 2]);
      expect(linearScale.getDomainForRange(1)).toBe(0);
      expect(linearScaleCopy.getDomainForRange(1)).toBe(1);
      expect(linearScaleCopy.getRange()).toEqual([0, 1]);

      linearScaleCopy.setRange([2, 3]);
      expect(linearScale.getDomainForRange(2)).toBe(1);
      expect(linearScaleCopy.getDomainForRange(2)).toBe(0);
      expect(linearScale.getRange()).toEqual([1, 2]);
      expect(linearScaleCopy.getRange()).toEqual([2, 3]);
    });

    test('interpolator being isolated from the copy', () => {
      const linearScale = new ScaleLinear().setRange([5, 8]),
            linearScaleCopy = linearScale.copy(),
            interpolator = linearScale.getInterpolator(),
            customInterpolator = (a, b) => () => b;

      linearScale.setInterpolator(customInterpolator);
      expect(linearScaleCopy.getInterpolator()).toEqual(interpolator);
      expect(linearScale.getRangeForDomain(0.5)).toBe(8);
      expect(linearScaleCopy.getRangeForDomain(0.5)).toBe(6.5);
    });

    test('clamping being isolated from the copy', () => {
      const linearScale = new ScaleLinear().setClamp(true),
            linearScaleCopy = linearScale.copy();

      linearScale.setClamp(false);
      expect(linearScale.getRangeForDomain(2)).toBe(2);
      expect(linearScaleCopy.getRangeForDomain(2)).toBe(1);
      expect(linearScaleCopy.getClamp()).toBeTruthy();

      linearScaleCopy.setClamp(false);
      expect(linearScale.getRangeForDomain(2)).toBe(2);
      expect(linearScaleCopy.getRangeForDomain(2)).toBe(2);
      expect(linearScale.getClamp()).toBeFalsy();
    });
  });
});
