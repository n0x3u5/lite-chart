import ScaleOrdinal from '../ordinal';

describe('An ordinal scale should', () => {
  describe('by default', () => {
    const ordinalScale = new ScaleOrdinal();

    test('have an empty range', () => {
      expect(ordinalScale.getRange()).toEqual([]);
    });
    test('have an empty domain', () => {
      expect(ordinalScale.getDomain()).toEqual([]);
    });
    test('be unable to return a range value for the domain value 0', () => {
      expect(ordinalScale.getRangeForDomain(0)).toBeUndefined();
    });
    test('have added 0 to its domain after the first query', () => {
      expect(ordinalScale.getDomain()).toEqual([0]);
    });
  });

  test('map a unique element in the domain to its corresponding range element', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain([0, 1]);
    ordinalScale.setRange(['no', 'yes']);

    expect(ordinalScale.getRangeForDomain(0)).toBe('no');
    expect(ordinalScale.getRangeForDomain(1)).toBe('yes');

    ordinalScale.setRange(['a', 'b', 'c']);

    expect(ordinalScale.getRangeForDomain(0)).toBe('a');
    expect(ordinalScale.getRangeForDomain('0')).toBe('a');
    expect(ordinalScale.getRangeForDomain([0])).toBe('a');

    expect(ordinalScale.getRangeForDomain(1)).toBe('b');

    expect(ordinalScale.getRangeForDomain(2.0)).toBe('c');
    expect(ordinalScale.getRangeForDomain(2)).toBe('c');
  });

  test('implicitly extend its domain when required to map a range outside its existing domain', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setRange(['no', 'yes']);

    expect(ordinalScale.getDomain()).toEqual([]);
    expect(ordinalScale.getRangeForDomain(0)).toBe('no');
    expect(ordinalScale.getDomain()).toEqual([0]);
    expect(ordinalScale.getRangeForDomain(1)).toBe('yes');
    expect(ordinalScale.getDomain()).toEqual([0, 1]);
    expect(ordinalScale.getRangeForDomain(0)).toBe('no');
    expect(ordinalScale.getDomain()).toEqual([0, 1]);
  });

  test('create a copy of the input domain', () => {
    const domain = ['red', 'green'],
          ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain(domain);

    domain.push('blue');

    expect(ordinalScale.getDomain()).toEqual(['red', 'green']);
  });

  test('return a copy of its domain when the domain is requested', () => {
    const ordinalScale = new ScaleOrdinal();
    let domain = [];

    ordinalScale.setDomain(['red', 'green']);
    domain = ordinalScale.getDomain();

    ordinalScale.getRangeForDomain('blue');

    expect(domain).toEqual(['red', 'green']);
  });

  test('replace the existing domain with a new one', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setRange(['foo', 'bar']);

    expect(ordinalScale.getRangeForDomain(1)).toBe('foo');
    expect(ordinalScale.getRangeForDomain(0)).toBe('bar');
    expect(ordinalScale.getDomain(1)).toEqual([1, 0]);
  });

  test('identify domain elements uniquely by string coercion', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain(['foo']);
    ordinalScale.setRange([1, 2, 3]);

    expect(ordinalScale.getRangeForDomain({ toString: () => 'foo' })).toBe(1);
    expect(ordinalScale.getRangeForDomain({ toString: () => 'boo' })).toBe(2);
  });

  test('not coerce domain elements into strings', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain([0, 1]);

    expect(ordinalScale.getDomain()).toEqual([0, 1]);
    expect(typeof ordinalScale.getDomain()[0]).toBe('number');
    expect(typeof ordinalScale.getDomain()[1]).toBe('number');
  });

  test('be able to deal with JavaScript object built-ins in the domain', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain(['__proto__', 'hasOwnProperty']);
    ordinalScale.setRange([42, 43]);

    expect(ordinalScale.getRangeForDomain('__proto__')).toBe(42);
    expect(ordinalScale.getRangeForDomain('hasOwnProperty')).toBe(43);
    expect(ordinalScale.getDomain()).toEqual(['__proto__', 'hasOwnProperty']);
  });

  test('order its domain in the correct order specified during input', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.getRangeForDomain('one');
    ordinalScale.getRangeForDomain('two');
    ordinalScale.getRangeForDomain('three');

    expect(ordinalScale.getDomain()).toEqual(['one', 'two', 'three']);

    ordinalScale.setDomain(['two', 'three']);
    ordinalScale.getRangeForDomain('one');

    expect(ordinalScale.getDomain()).toEqual(['two', 'three', 'one']);

    ordinalScale.setDomain(['three', 'one']);

    expect(ordinalScale.getDomain()).toEqual(['three', 'one']);

    ordinalScale.setDomain([]);
    ordinalScale.getRangeForDomain('four');
    ordinalScale.getRangeForDomain('two');

    expect(ordinalScale.getDomain()).toEqual(['four', 'two']);
  });

  test('create a copy of the input range', () => {
    const range = ['red', 'green'],
          ordinalScale = new ScaleOrdinal();

    ordinalScale.setRange(range);
    range.push('blue');

    expect(ordinalScale.getRange()).toEqual(['red', 'green']);
  });

  test('return a copy of the its range when requested', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setRange(['red', 'green']);

    const range = ordinalScale.getRange();

    expect(range).toEqual(['red', 'green']);

    range.push('blue');

    expect(ordinalScale.getRange()).toEqual(['red', 'green']);
  });

  test('correctly update its range\'s implicit domain associations', () => {
    const ordinalScale = new ScaleOrdinal();

    expect(ordinalScale.getRangeForDomain(0)).toBeUndefined();
    expect(ordinalScale.getRangeForDomain(1)).toBeUndefined();

    ordinalScale.setRange(['foo', 'bar']);

    expect(ordinalScale.getRangeForDomain(1)).toBe('bar');
    expect(ordinalScale.getRangeForDomain(0)).toBe('foo');
  });

  test('recycle range values when exhausted', () => {
    const ordinalScale = new ScaleOrdinal();
    ordinalScale.setRange(['a', 'b', 'c']);

    expect(ordinalScale.getRangeForDomain(0)).toBe('a');
    expect(ordinalScale.getRangeForDomain(1)).toBe('b');
    expect(ordinalScale.getRangeForDomain(2)).toBe('c');
    expect(ordinalScale.getRangeForDomain(3)).toBe('a');
    expect(ordinalScale.getRangeForDomain(4)).toBe('b');
    expect(ordinalScale.getRangeForDomain(5)).toBe('c');
    expect(ordinalScale.getRangeForDomain(2)).toBe('c');
    expect(ordinalScale.getRangeForDomain(1)).toBe('b');
    expect(ordinalScale.getRangeForDomain(0)).toBe('a');
  });

  test('allow setting the unknown value for unknown inputs', () => {
    const ordinalScale = new ScaleOrdinal();

    ordinalScale.setDomain(['lorem', 'dolor']);
    ordinalScale.setUnknown('.');
    ordinalScale.setRange(['ipsum', 'si']);

    expect(ordinalScale.getRangeForDomain('lorem')).toBe('ipsum');
    expect(ordinalScale.getRangeForDomain('dolor')).toBe('si');
    expect(ordinalScale.getRangeForDomain('amet')).toBe('.');
    expect(ordinalScale.getRangeForDomain('is')).toBe('.');
  });

  test('not implicitly extend the domain if the unknown is not implicit', () => {
    const ordinalScale = new ScaleOrdinal();
    ordinalScale.setDomain(['fun', 'danger']);
    ordinalScale.setUnknown(undefined);
    ordinalScale.setRange(['blue', 'red']);

    expect(ordinalScale.getRangeForDomain('party')).toBeUndefined();
    expect(ordinalScale.getDomain()).toEqual(['fun', 'danger']);
  });

  test('should be able to copy itself correctly', () => {
    const ordinalScale = new ScaleOrdinal();
    ordinalScale.setDomain(['a', 'b']);
    ordinalScale.setRange([1, 2]);
    ordinalScale.setUnknown(0);

    const ordinalScaleCopy = ordinalScale.copy();

    expect(ordinalScaleCopy.getDomain()).toEqual(ordinalScale.getDomain());
    expect(ordinalScaleCopy.getRange()).toEqual(ordinalScale.getRange());
    expect(ordinalScaleCopy.getUnknown()).toEqual(ordinalScale.getUnknown());
  });

  test('should not be affected by changes to a copied scale\'s domain', () => {
    const ordinalScale = new ScaleOrdinal();
    ordinalScale.setRange(['foo', 'bar']);

    const ordinalScaleCopy = ordinalScale.copy();

    ordinalScale.setDomain([1, 2]);

    expect(ordinalScaleCopy.getDomain()).toEqual([]);
    expect(ordinalScale.getRangeForDomain(1)).toBe('foo');
    expect(ordinalScaleCopy.getRangeForDomain(1)).toBe('foo');

    ordinalScaleCopy.setDomain([2, 3]);

    expect(ordinalScale.getRangeForDomain(2)).toBe('bar');
    expect(ordinalScaleCopy.getRangeForDomain(2)).toBe('foo');
    expect(ordinalScale.getDomain()).toEqual([1, 2]);
    expect(ordinalScaleCopy.getDomain()).toEqual([2, 3]);
  });

  test('should not be affected by changes to a copied scale\'s range', () => {
    const ordinalScale = new ScaleOrdinal();
    ordinalScale.setRange(['foo', 'bar']);

    const ordinalScaleCopy = ordinalScale.copy();

    ordinalScale.setRange(['bar', 'foo']);

    expect(ordinalScale.getRangeForDomain(1)).toBe('bar');
    expect(ordinalScaleCopy.getRangeForDomain(1)).toBe('foo');
    expect(ordinalScaleCopy.getRange()).toEqual(['foo', 'bar']);

    ordinalScaleCopy.setRange(['foo', 'baz']);

    expect(ordinalScale.getRangeForDomain(2)).toBe('foo');
    expect(ordinalScaleCopy.getRangeForDomain(2)).toBe('baz');
    expect(ordinalScale.getRange()).toEqual(['bar', 'foo']);
    expect(ordinalScaleCopy.getRange()).toEqual(['foo', 'baz']);
  });
});

