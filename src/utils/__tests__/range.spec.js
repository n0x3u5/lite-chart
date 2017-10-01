import range from '../range';

describe('range(stop) should', () => {
  test('return [0, 1, 2, ..., stop - 1]', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(2.01)).toEqual([0, 1, 2]);
    expect(range(1)).toEqual([0]);
    expect(range(0.5)).toEqual([0]);
  });

  test('return an empty array if stop <= 0', () => {
    expect(range(0)).toEqual([]);
    expect(range(-0.5)).toEqual([]);
    expect(range(-1)).toEqual([]);
  });

  test('return an empty array if stop is NaN', () => {
    expect(range(NaN)).toEqual([]);
    expect(range()).toEqual([]);
  });
});

describe('range(start, stop) should', () => {
  test('return [start, start + 1, ..., stop - 1]', () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(2, 5)).toEqual([2, 3, 4]);
    expect(range(2.5, 5)).toEqual([2.5, 3.5, 4.5]);
    expect(range(-1, 3)).toEqual([-1, 0, 1, 2]);
  });

  test('return an empty array if start or stop is NaN', () => {
    expect(range(0, NaN)).toEqual([]);
    expect(range(1, NaN)).toEqual([]);
    expect(range(-1, NaN)).toEqual([]);
    expect(range(NaN, 0)).toEqual([]);
    expect(range(NaN, 1)).toEqual([]);
    expect(range(NaN, -1)).toEqual([]);

    expect(range(NaN, NaN)).toEqual([]);
  });

  test('return an empty array if start or stop is undefined', () => {
    expect(range(0, undefined)).toEqual([]);
    expect(range(1, undefined)).toEqual([]);
    expect(range(-1, undefined)).toEqual([]);
    expect(range(undefined, 0)).toEqual([]);
    expect(range(undefined, 1)).toEqual([]);
    expect(range(undefined, -1)).toEqual([]);

    expect(range(undefined, undefined)).toEqual([]);
  });

  test('return an empty array if start >= stop', () => {
    expect(range(0, 0)).toEqual([]);
    expect(range(5, 5)).toEqual([]);
    expect(range(6, 5)).toEqual([]);
    expect(range(10, 10)).toEqual([]);
    expect(range(20, 10)).toEqual([]);
  });
});

describe('range(start, stop, step) should', () => {
  test('return [start, start + step, start + (step * 2), ..., stop - step]', () => {
    expect(range(0, 5, 1)).toEqual([0, 1, 2, 3, 4]);
    expect(range(0, 5, 2)).toEqual([0, 2, 4]);
    expect(range(2, 5, 2)).toEqual([2, 4]);
    expect(range(-1, 3, 2)).toEqual([-1, 1]);
  });

  test('allow negative steps', () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
    expect(range(5, 0, -2)).toEqual([5, 3, 1]);
    expect(range(5, 2, -2)).toEqual([5, 3]);
    expect(range(3, -1, -2)).toEqual([3, 1]);
  });

  test('return an empty array if start >= stop and step > 0', () => {
    expect(range(5, 5, 2)).toEqual([]);
    expect(range(6, 5, 2)).toEqual([]);
    expect(range(10, 10, 1)).toEqual([]);
    expect(range(10, 10, 0.5)).toEqual([]);
    expect(range(0, 0, 1)).toEqual([]);
    expect(range(0, 0, 0.5)).toEqual([]);
    expect(range(20, 10, 2)).toEqual([]);
    expect(range(20, 10, 1)).toEqual([]);
    expect(range(20, 10, 0.5)).toEqual([]);
  });

  test('returns an empty array if start, stop or step is NaN', () => {
    expect(range(NaN, 3, 2)).toEqual([]);
    expect(range(3, NaN, 2)).toEqual([]);
    expect(range(0, 5, NaN)).toEqual([]);
    expect(range(0, 10, NaN)).toEqual([]);
    expect(range(10, 0, NaN)).toEqual([]);
    expect(range(NaN, NaN, NaN)).toEqual([]);
    expect(range(NaN, NaN, NaN)).toEqual([]);
  });

  test('returns an empty array if start, stop or step is undefined', () => {
    expect(range(undefined, undefined, undefined)).toEqual([]);
    expect(range(0, 10, undefined)).toEqual([]);
    expect(range(10, 0, undefined)).toEqual([]);
  });

  test('returns an empty array if step is 0', () => {
    expect(range(0, 5, 0)).toEqual([]);
  });

  test('returns the correct sequence for when step is fractional', () => {
    expect(range(0.5, 0, -0.1)).toEqual([
      0.5 - (0.1 * 0),
      0.5 - (0.1 * 1),
      0.5 - (0.1 * 2),
      0.5 - (0.1 * 3),
      0.5 - (0.1 * 4)
    ]);
    expect(range(-2, -1.2, 0.1)).toEqual([
      -2 + (0.1 * 0),
      -2 + (0.1 * 1),
      -2 + (0.1 * 2),
      -2 + (0.1 * 3),
      -2 + (0.1 * 4),
      -2 + (0.1 * 5),
      -2 + (0.1 * 6),
      -2 + (0.1 * 7)
    ]);
    expect(range(5e-31, 2.1e-31, -1.1e-31)).toEqual([
      5e-31 - (1.1e-31 * 0),
      5e-31 - (1.1e-31 * 1),
      5e-31 - (1.1e-31 * 2)
    ]);
    expect(range(2e300, 1e300, -0.3e300)).toEqual([
      2e300 - (0.3e300 * 0),
      2e300 - (0.3e300 * 1),
      2e300 - (0.3e300 * 2),
      2e300 - (0.3e300 * 3)
    ]);
  });
});
