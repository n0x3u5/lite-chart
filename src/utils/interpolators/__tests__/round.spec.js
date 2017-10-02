import interpolateRound from '../round';

describe('interpolateRound(a, b) should', () => {
  test('not round a and b before interpolation', () => {
    const interpolator = interpolateRound(2.6, 3.6);

    expect(interpolator(0.6)).toBe(3);
  });

  test('interpolate rounded values between two numbers a and b', () => {
    const interpolator = interpolateRound(10, 42);

    expect(interpolator(0.0)).toBe(10);
    expect(interpolator(0.1)).toBe(13);
    expect(interpolator(0.2)).toBe(16);
    expect(interpolator(0.3)).toBe(20);
    expect(interpolator(0.4)).toBe(23);
    expect(interpolator(0.5)).toBe(26);
    expect(interpolator(0.6)).toBe(29);
    expect(interpolator(0.7)).toBe(32);
    expect(interpolator(0.8)).toBe(36);
    expect(interpolator(0.9)).toBe(39);
    expect(interpolator(1.0)).toBe(42);
  });
});
