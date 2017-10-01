import ScaleBand from '../band';

describe('A band scale should', () => {
  describe('by default', () => {
    const bandScale = new ScaleBand();

    test('have an empty domain', () => {
      expect(bandScale.getDomain()).toEqual([]);
    });

    test('have the range set to [0, 1]', () => {
      expect(bandScale.getRange()).toEqual([0, 1]);
    });

    test('have the bandwidth be of unit width', () => {
      expect(bandScale.getBandwidth()).toBe(1);
    });

    test('have the step set to unit width', () => {
      expect(bandScale.getStep()).toBe(1);
    });

    test('not round its values', () => {
      expect(bandScale.getRound()).toBe(false);
    });

    test('not have any inner padding', () => {
      expect(bandScale.getPaddingInner()).toBe(0);
    });

    test('not have any outer padding', () => {
      expect(bandScale.getPaddingOuter()).toBe(0);
    });

    test('be aligned centrally (i.e. have an alignment value of 0.5)', () => {
      expect(bandScale.getAlignment()).toBe(0.5);
    });
  });

  test('compute discrete bands in a range', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setRange([0, 960]);

    expect(bandScale.getRangeForDomain('foo')).toBeUndefined();

    bandScale.setDomain(['foo', 'bar']);

    expect(bandScale.getRangeForDomain('foo')).toBe(0);
    expect(bandScale.getRangeForDomain('bar')).toBe(480);

    bandScale.setDomain(['x', 'y', 'z']);
    bandScale.setRange([0, 120]);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([0, 40, 80]);
    expect(bandScale.getBandwidth()).toBe(40);

    bandScale.setPadding(0.2);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([7.5, 45, 82.5]);
    expect(bandScale.getBandwidth()).toBe(30);
  });

  test('return undefined for values outside the domain', () => {
    const bandScale = new ScaleBand();
    bandScale.setDomain(['a', 'b', 'c']);

    expect(bandScale.getRangeForDomain('d')).toBeUndefined();
    expect(bandScale.getRangeForDomain('e')).toBeUndefined();
    expect(bandScale.getRangeForDomain('f')).toBeUndefined();
  });

  test('not implicitly add values to its domain', () => {
    const bandScale = new ScaleBand();

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.getRangeForDomain('d');
    bandScale.getRangeForDomain('e');

    expect(bandScale.getDomain()).toEqual(['a', 'b', 'c']);
  });

  test('provide the distance between the starts of two adjacent bands', () => {
    const bandScale = new ScaleBand();

    bandScale.setRange([0, 960]);

    expect(bandScale.setDomain(['foo']).getStep()).toBe(960);
    expect(bandScale.setDomain(['foo', 'bar']).getStep()).toBe(480);
    expect(bandScale.setDomain(['foo', 'bar', 'baz']).getStep()).toBe(320);

    bandScale.setPadding(0.5);

    expect(bandScale.setDomain(['foo']).getStep()).toBe(640);
    expect(bandScale.setDomain(['foo', 'bar']).getStep()).toBe(384);
  });

  test('provide the width of the band', () => {
    const bandScale = new ScaleBand();

    bandScale.setRange([0, 960]);

    expect(bandScale.setDomain([]).getBandwidth()).toBe(960);
    expect(bandScale.setDomain(['foo']).getBandwidth()).toBe(960);
    expect(bandScale.setDomain(['foo', 'bar']).getBandwidth()).toBe(480);
    expect(bandScale.setDomain(['foo', 'bar', 'baz']).getBandwidth()).toBe(320);

    bandScale.setPadding(0.5);

    expect(bandScale.setDomain([]).getBandwidth()).toBe(480);
    expect(bandScale.setDomain(['foo']).getBandwidth()).toBe(320);
    expect(bandScale.setDomain(['foo', 'bar']).getBandwidth()).toBe(192);
  });

  test('compute reasonable band and step values', () => {
    const bandScale = new ScaleBand();
    bandScale.setDomain([]);
    bandScale.setRange([0, 960]);

    expect(bandScale.getStep()).toBe(960);
    expect(bandScale.getBandwidth()).toBe(960);

    bandScale.setPadding(0.5);

    expect(bandScale.getStep()).toBe(960);
    expect(bandScale.getBandwidth()).toBe(480);

    bandScale.setPadding(1);

    expect(bandScale.getStep()).toBe(960);
    expect(bandScale.getBandwidth()).toBe(0);
  });

  test('computes a reasonable bandwidth for a single value, even with padding', () => {
    const bandScale = new ScaleBand();

    bandScale.setDomain(['foo']);
    bandScale.setRange([0, 960]);

    expect(bandScale.getRangeForDomain('foo')).toBe(0);
    expect(bandScale.getStep()).toBe(960);
    expect(bandScale.getBandwidth()).toBe(960);

    bandScale.setPadding(0.5);

    expect(bandScale.getRangeForDomain('foo')).toBe(320);
    expect(bandScale.getStep()).toBe(640);
    expect(bandScale.getBandwidth()).toBe(320);

    bandScale.setPadding(1);

    expect(bandScale.getRangeForDomain('foo')).toBe(480);
    expect(bandScale.getStep()).toBe(480);
    expect(bandScale.getBandwidth()).toBe(0);
  });

  test('bandwidth is recalculated on setting the domain', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.rangeRound([0, 100]);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([1, 34, 67]);
    expect(bandScale.getBandwidth()).toBe(33);

    bandScale.setDomain(['a', 'b', 'c', 'd']);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([0, 25, 50, 75]);
    expect(bandScale.getBandwidth()).toBe(25);
  });

  test('make a copy of the input domain', () => {
    const domain = ['red', 'green'],
          bandScale = new ScaleBand();

    bandScale.setDomain(domain);
    domain.push('blue');

    expect(bandScale.getDomain()).toEqual(['red', 'green']);
  });

  test('return a copy of its domain', () => {
    const bandScale = new ScaleBand();

    bandScale.setDomain(['red', 'green']);

    const domain = bandScale.getDomain();

    expect(domain).toEqual(['red', 'green']);

    domain.push('blue');

    expect(bandScale.getDomain()).toEqual(['red', 'green']);
  });

  test('accept range in descending order', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.setRange([120, 0]);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([80, 40, 0]);
    expect(bandScale.getBandwidth()).toBe(40);

    bandScale.setPadding(0.2);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([82.5, 45, 7.5]);
    expect(bandScale.getBandwidth()).toBe(30);
  });

  test('make a copy of the input range', () => {
    const range = [1, 2],
          bandScale = new ScaleBand();

    bandScale.setRange(range);

    range.push('blue');

    expect(bandScale.getRange()).toEqual([1, 2]);
  });

  test('return a copy of its range', () => {
    const bandScale = new ScaleBand();

    bandScale.setRange([1, 2]);

    const range = bandScale.getRange();

    expect(range).toEqual([1, 2]);

    range.push('blue');

    expect(bandScale.getRange()).toEqual([1, 2]);
  });

  test('coerce its input range into numbers', () => {
    const bandScale = new ScaleBand();

    bandScale.setRange(['1.0', '2.0']);

    expect(bandScale.getRange()).toEqual([1, 2]);
  });

  test('add the correct amount of inner padding', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.setRange([120, 0]);
    bandScale.setPaddingInner(0.1);
    bandScale.setRound(true);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([83, 42, 1]);
    expect(bandScale.getBandwidth()).toBe(37);

    bandScale.setPaddingInner(0.2);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([85, 43, 1]);
    expect(bandScale.getBandwidth()).toBe(34);
  });

  test('clamp the input inner padding between 0 and 1 (inclusive)', () => {
    const bandScale = new ScaleBand();

    expect(bandScale.setPaddingInner('1.0').getPaddingInner()).toBe(1);
    expect(bandScale.setPaddingInner('-1.0').getPaddingInner()).toBe(0);
    expect(bandScale.setPaddingInner('2.0').getPaddingInner()).toBe(1);
    expect(Number.isNaN(bandScale.setPaddingInner(NaN).getPaddingInner())).toBeTruthy();
  });

  test('add the correct amount of outer padding', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.setRange([120, 0]);
    bandScale.setPaddingInner(0.2);
    bandScale.setPaddingOuter(0.1);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([84, 44, 4]);
    expect(bandScale.getBandwidth()).toBe(32);

    bandScale.setPaddingOuter(1);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([75, 50, 25]);
    expect(bandScale.getBandwidth()).toBe(20);
  });

  test('clamp the input outer padding between 0 and 1 (inclusive)', () => {
    const bandScale = new ScaleBand();

    expect(bandScale.setPaddingOuter('1.0').getPaddingOuter()).toBe(1);
    expect(bandScale.setPaddingOuter('-1.0').getPaddingOuter()).toBe(0);
    expect(bandScale.setPaddingOuter('2.0').getPaddingOuter()).toBe(1);
    expect(Number.isNaN(bandScale.setPaddingOuter(NaN).getPaddingOuter())).toBeTruthy();
  });

  test('return discrete rounded bands in a continuous range when rounding is enabled', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.setRange([0, 100]);
    bandScale.setRound(true);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([1, 34, 67]);
    expect(bandScale.getBandwidth()).toBe(33);

    bandScale.setPadding(0.2);

    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([7, 38, 69]);
    expect(bandScale.getBandwidth()).toBe(25);
  });

  test('allows for a shorthand to set the range and enable rounding', () => {
    const bandScale = new ScaleBand();

    bandScale.setDomain(['a', 'b', 'c']);
    bandScale.rangeRound([0, 100]);

    expect(bandScale.getRange()).toEqual([0, 100]);
    expect(bandScale.getRound()).toBeTruthy();
  });

  test('correctly creates a copy of all its properties when copied', () => {
    const bandScale = new ScaleBand();

    bandScale.setDomain(['red', 'green']);
    bandScale.setRange([1, 2]);
    bandScale.setRound(true);
    bandScale.setPaddingInner(0.1);
    bandScale.setPaddingOuter(0.2);

    const bandScaleCopy = bandScale.copy();

    expect(bandScaleCopy.getDomain()).toEqual(bandScale.getDomain());
    expect(bandScaleCopy.getRange()).toEqual(bandScale.getRange());
    expect(bandScaleCopy.getRound()).toBe(bandScale.getRound());
    expect(bandScaleCopy.getPaddingInner()).toBe(bandScale.getPaddingInner());
    expect(bandScaleCopy.getPaddingOuter()).toBe(bandScale.getPaddingOuter());
  });

  test('changes to the domain do not affect domain of the copied scale', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['foo', 'bar']);
    bandScale.setRange([0, 2]);

    const bandScaleCopy = bandScale.copy(),
          getRangeForDomainCopy = bandScaleCopy.getRangeForDomain;

    bandScale.setDomain(['red', 'blue']);

    expect(bandScaleCopy.getDomain()).toEqual(['foo', 'bar']);
    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([0, 1]);
    expect(bandScaleCopy.getDomain().map(getRangeForDomainCopy.bind(bandScaleCopy)))
      .toEqual([0, 1]);

    bandScaleCopy.setDomain(['red', 'blue']);

    expect(bandScale.getDomain()).toEqual(['red', 'blue']);
    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([0, 1]);
    expect(bandScaleCopy.getDomain().map(getRangeForDomainCopy.bind(bandScaleCopy)))
      .toEqual([0, 1]);
  });

  test('band.copy() isolates changes to the range', () => {
    const bandScale = new ScaleBand(),
          { getRangeForDomain } = bandScale;

    bandScale.setDomain(['foo', 'bar']);
    bandScale.setRange([0, 2]);

    const bandScaleCopy = bandScale.copy(),
          getRangeForDomainCopy = bandScaleCopy.getRangeForDomain;

    bandScale.setRange([3, 5]);

    expect(bandScaleCopy.getRange()).toEqual([0, 2]);
    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([3, 4]);
    expect(bandScaleCopy.getDomain().map(getRangeForDomainCopy.bind(bandScaleCopy)))
      .toEqual([0, 1]);

    bandScaleCopy.setRange([5, 7]);

    expect(bandScale.getRange()).toEqual([3, 5]);
    expect(bandScale.getDomain().map(getRangeForDomain.bind(bandScale))).toEqual([3, 4]);
    expect(bandScaleCopy.getDomain().map(getRangeForDomainCopy.bind(bandScaleCopy)))
      .toEqual([5, 6]);
  });
});
