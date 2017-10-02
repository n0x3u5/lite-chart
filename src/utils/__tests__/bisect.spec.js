import bisect, { bisectRight, bisectLeft } from '../bisect';

test('bisect is the same as bisectRight', () => {
  expect(bisect).toEqual(bisectRight);
});

describe('bisectLeft(array, value) should', () => {
  test('return the index of an exact match', () => {
    const numbers = [1, 2, 3];

    expect(bisectLeft(numbers, 1)).toBe(0);
    expect(bisectLeft(numbers, 2)).toBe(1);
    expect(bisectLeft(numbers, 3)).toBe(2);
  });

  test('return the index of the first match', () => {
    const objects = [1, 2, 2, 3];

    expect(bisectLeft(objects, 1)).toBe(0);
    expect(bisectLeft(objects, 2)).toBe(1);
    expect(bisectLeft(objects, 3)).toBe(3);
  });

  test('return the insertion point of a non-exact match', () => {
    const objects = [1, 2, 3];

    expect(bisectLeft(objects, 0.5)).toBe(0);
    expect(bisectLeft(objects, 1.5)).toBe(1);
    expect(bisectLeft(objects, 2.5)).toBe(2);
    expect(bisectLeft(objects, 3.5)).toBe(3);
  });

  test('not know what to do if the search value is unorderable', () => {
    const objects = [1, 2, 3];

    bisectLeft(objects, new Date(NaN)); // who knows what this will return!
    bisectLeft(objects, undefined);
    bisectLeft(objects, NaN);
  });

  test('handle sparse arrays', () => {
    const objects = [];

    let i = 1073741824,
        j = 1;

    // Preparing sparse array
    while (i < 1073741829) {
      objects[i] = j;
      i += 1;
      j += 1;
    }

    expect(bisectLeft(objects, 0, i - 5, i)).toBe(i - 5);
    expect(bisectLeft(objects, 1, i - 5, i)).toBe(i - 5);
    expect(bisectLeft(objects, 2, i - 5, i)).toBe(i - 4);
    expect(bisectLeft(objects, 3, i - 5, i)).toBe(i - 3);
    expect(bisectLeft(objects, 4, i - 5, i)).toBe(i - 2);
    expect(bisectLeft(objects, 5, i - 5, i)).toBe(i - 1);
    expect(bisectLeft(objects, 6, i - 5, i)).toBe(i - 0);
  });
});

describe('bisectLeft(array, value, lo) should', () => {
  test('respect the specified lower bound', () => {
    const objects = [1, 2, 3, 4, 5];

    expect(bisectLeft(objects, 0, 2)).toEqual(2);
    expect(bisectLeft(objects, 1, 2)).toEqual(2);
    expect(bisectLeft(objects, 2, 2)).toEqual(2);
    expect(bisectLeft(objects, 3, 2)).toEqual(2);
    expect(bisectLeft(objects, 4, 2)).toEqual(3);
    expect(bisectLeft(objects, 5, 2)).toEqual(4);
    expect(bisectLeft(objects, 6, 2)).toEqual(5);
  });
});

describe('bisectLeft(array, value, lo, hi) should', () => {
  test('respect the specified lower and upper bounds', () => {
    const objects = [1, 2, 3, 4, 5];

    expect(bisectLeft(objects, 0, 2, 3)).toBe(2);
    expect(bisectLeft(objects, 1, 2, 3)).toBe(2);
    expect(bisectLeft(objects, 2, 2, 3)).toBe(2);
    expect(bisectLeft(objects, 3, 2, 3)).toBe(2);
    expect(bisectLeft(objects, 4, 2, 3)).toBe(3);
    expect(bisectLeft(objects, 5, 2, 3)).toBe(3);
    expect(bisectLeft(objects, 6, 2, 3)).toBe(3);
  });
});

describe('bisectRight(array, value) should', () => {
  test('return the index of an exact match', () => {
    const objects = [1, 2, 3];

    expect(bisectRight(objects, 1)).toBe(1);
    expect(bisectRight(objects, 2)).toBe(2);
    expect(bisectRight(objects, 3)).toBe(3);
  });

  test('return the index after the last match', () => {
    const objects = [1, 2, 2, 3];

    expect(bisectRight(objects, 1)).toBe(1);
    expect(bisectRight(objects, 2)).toBe(3);
    expect(bisectRight(objects, 3)).toBe(4);
  });

  test('return the insertion point of a non-exact match', () => {
    const objects = [1, 2, 3];

    expect(bisectRight(objects, 0.5)).toBe(0);
    expect(bisectRight(objects, 1.5)).toBe(1);
    expect(bisectRight(objects, 2.5)).toBe(2);
    expect(bisectRight(objects, 3.5)).toBe(3);
  });

  test('handle sparse arrays', () => {
    const objects = [];

    let i = 1073741824,
        j = 1;

    // Preparing sparse array
    while (i < 1073741829) {
      objects[i] = j;
      i += 1;
      j += 1;
    }

    expect(bisectRight(objects, 0, i - 5, i)).toBe(i - 5);
    expect(bisectRight(objects, 1, i - 5, i)).toBe(i - 4);
    expect(bisectRight(objects, 2, i - 5, i)).toBe(i - 3);
    expect(bisectRight(objects, 3, i - 5, i)).toBe(i - 2);
    expect(bisectRight(objects, 4, i - 5, i)).toBe(i - 1);
    expect(bisectRight(objects, 5, i - 5, i)).toBe(i - 0);
    expect(bisectRight(objects, 6, i - 5, i)).toBe(i - 0);
  });
});

describe('bisectRight(array, value, lo) should', () => {
  test('respect the specified lower bound', () => {
    const objects = [1, 2, 3, 4, 5];

    expect(bisectRight(objects, 0, 2)).toEqual(2);
    expect(bisectRight(objects, 1, 2)).toEqual(2);
    expect(bisectRight(objects, 2, 2)).toEqual(2);
    expect(bisectRight(objects, 3, 2)).toEqual(3);
    expect(bisectRight(objects, 4, 2)).toEqual(4);
    expect(bisectRight(objects, 5, 2)).toEqual(5);
    expect(bisectRight(objects, 6, 2)).toEqual(5);
  });
});

describe('bisectRight(array, value, lo, hi) should', () => {
  test('respect the specified lower and upper bounds', () => {
    const objects = [1, 2, 3, 4, 5];

    expect(bisectRight(objects, 0, 2, 3)).toBe(2);
    expect(bisectRight(objects, 1, 2, 3)).toBe(2);
    expect(bisectRight(objects, 2, 2, 3)).toBe(2);
    expect(bisectRight(objects, 3, 2, 3)).toBe(3);
    expect(bisectRight(objects, 4, 2, 3)).toBe(3);
    expect(bisectRight(objects, 5, 2, 3)).toBe(3);
    expect(bisectRight(objects, 6, 2, 3)).toBe(3);
  });
});

