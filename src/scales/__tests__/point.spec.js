import ScalePoint from '../point';

describe('A point scale should', () => {
  describe('by default', () => {
    const pointScale = new ScalePoint();

    test('have an empty domain', () => {
      expect(pointScale.getDomain()).toEqual([]);
    });

    test('have the range set to [0, 1]', () => {
      expect(pointScale.getRange()).toEqual([0, 1]);
    });

    test('have the bandwidth be of unit width', () => {
      expect(pointScale.getBandwidth()).toBe(1);
    });

    test('have the step set to unit width', () => {
      expect(pointScale.getStep()).toBe(1);
    });

    test('not round its values', () => {
      expect(pointScale.getRound()).toBe(false);
    });

    test('not have any padding', () => {
      expect(pointScale.getPadding()).toBe(0);
    });

    test('be aligned centrally (i.e. have an alignment value of 0.5)', () => {
      expect(pointScale.getAlignment()).toBe(0.5);
    });
  });

  test('compute discrete bands in a range', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setRange([0, 960]);

    expect(pointScale.getRangeForDomain('foo')).toBeUndefined();

    pointScale.setDomain(['foo', 'bar']);

    expect(pointScale.getRangeForDomain('foo')).toBe(0);
    expect(pointScale.getRangeForDomain('bar')).toBe(960);

    pointScale.setDomain(['x', 'y', 'z']);
    pointScale.setRange([0, 120]);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([0, 60, 120]);
    expect(pointScale.getBandwidth()).toBe(0);

    pointScale.setPadding(0.2);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([10, 60, 110]);
    expect(pointScale.getBandwidth()).toBe(0);
  });

  test('provide the distance between the starts of two adjacent bands', () => {
    const pointScale = new ScalePoint();

    pointScale.setRange([0, 960]);

    expect(pointScale.setDomain(['foo']).getStep()).toBe(960);
    expect(pointScale.setDomain(['foo', 'bar']).getStep()).toBe(960);
    expect(pointScale.setDomain(['foo', 'bar', 'baz']).getStep()).toBe(480);

    pointScale.setPadding(0.5);

    expect(pointScale.setDomain(['foo']).getStep()).toBe(960);
    expect(pointScale.setDomain(['foo', 'bar']).getStep()).toBe(480);
  });

  test('have no band width', () => {
    const pointScale = new ScalePoint();

    pointScale.setRange([0, 960]);

    expect(pointScale.setDomain([]).getBandwidth()).toBe(0);
    expect(pointScale.setDomain(['foo']).getBandwidth()).toBe(0);
    expect(pointScale.setDomain(['foo', 'bar']).getBandwidth()).toBe(0);
    expect(pointScale.setDomain(['foo', 'bar', 'baz']).getBandwidth()).toBe(0);

    pointScale.setPadding(0.5);

    expect(pointScale.setDomain([]).getBandwidth()).toBe(0);
    expect(pointScale.setDomain(['foo']).getBandwidth()).toBe(0);
    expect(pointScale.setDomain(['foo', 'bar']).getBandwidth()).toBe(0);
  });

  test('compute reasonable step values', () => {
    const pointScale = new ScalePoint();
    pointScale.setDomain([]);
    pointScale.setRange([0, 960]);

    expect(pointScale.getStep()).toBe(960);

    pointScale.setPadding(0.5);

    expect(pointScale.getStep()).toBe(960);

    pointScale.setPadding(1);

    expect(pointScale.getStep()).toBe(960);
  });

  test('accept range in descending order', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setDomain(['a', 'b', 'c']);
    pointScale.setRange([120, 0]);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([120, 60, 0]);
    expect(pointScale.getBandwidth()).toBe(0);

    pointScale.setPadding(0.2);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([110, 60, 10]);
    expect(pointScale.getBandwidth()).toBe(0);
  });

  test('add the correct amount of padding', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setDomain(['a', 'b', 'c']);
    pointScale.rangeRound([120, 0]);
    pointScale.setPadding(0.1);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([114, 60, 6]);
    expect(pointScale.getBandwidth()).toBe(0);

    pointScale.setPadding(1);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([90, 60, 30]);
    expect(pointScale.getBandwidth()).toBe(0);
  });

  test('return discrete rounded bands in a continuous range when rounding is enabled', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setDomain(['a', 'b', 'c']);
    pointScale.setRange([0, 100]);
    pointScale.setRound(true);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([0, 50, 100]);
    expect(pointScale.getBandwidth()).toBe(0);

    pointScale.setPadding(0.2);

    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([9, 50, 91]);
    expect(pointScale.getBandwidth()).toBe(0);
  });

  test('changes to the domain do not affect domain of the copied scale', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setDomain(['foo', 'bar']);
    pointScale.setRange([0, 2]);

    const pointScaleCopy = pointScale.copy(),
          getRangeForDomainCopy = pointScaleCopy.getRangeForDomain;

    pointScale.setDomain(['red', 'blue']);

    expect(pointScaleCopy.getDomain()).toEqual(['foo', 'bar']);
    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([0, 2]);
    expect(pointScaleCopy.getDomain().map(getRangeForDomainCopy.bind(pointScaleCopy)))
      .toEqual([0, 2]);

    pointScaleCopy.setDomain(['red', 'blue']);

    expect(pointScale.getDomain()).toEqual(['red', 'blue']);
    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([0, 2]);
    expect(pointScaleCopy.getDomain().map(getRangeForDomainCopy.bind(pointScaleCopy)))
      .toEqual([0, 2]);
  });

  test('band.copy() isolates changes to the range', () => {
    const pointScale = new ScalePoint(),
          { getRangeForDomain } = pointScale;

    pointScale.setDomain(['foo', 'bar']);
    pointScale.setRange([0, 2]);

    const pointScaleCopy = pointScale.copy(),
          getRangeForDomainCopy = pointScaleCopy.getRangeForDomain;

    pointScale.setRange([3, 5]);

    expect(pointScaleCopy.getRange()).toEqual([0, 2]);
    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([3, 5]);
    expect(pointScaleCopy.getDomain().map(getRangeForDomainCopy.bind(pointScaleCopy)))
      .toEqual([0, 2]);

    pointScaleCopy.setRange([5, 7]);

    expect(pointScale.getRange()).toEqual([3, 5]);
    expect(pointScale.getDomain().map(getRangeForDomain.bind(pointScale))).toEqual([3, 5]);
    expect(pointScaleCopy.getDomain().map(getRangeForDomainCopy.bind(pointScaleCopy)))
      .toEqual([5, 7]);
  });
});
