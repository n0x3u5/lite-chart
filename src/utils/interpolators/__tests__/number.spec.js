import interpolateNumber from '../number';
import inDelta from './inDelta';

describe('interpolateNumber(a, b) should', () => {
  test('interpolate between a and b', () => {
    const interpolator = interpolateNumber(10, 42);

    expect(inDelta(interpolator(0.0), 10.0)).toBeTruthy();
    expect(inDelta(interpolator(0.1), 13.2)).toBeTruthy();
    expect(inDelta(interpolator(0.2), 16.4)).toBeTruthy();
    expect(inDelta(interpolator(0.3), 19.6)).toBeTruthy();
    expect(inDelta(interpolator(0.4), 22.8)).toBeTruthy();
    expect(inDelta(interpolator(0.5), 26.0)).toBeTruthy();
    expect(inDelta(interpolator(0.6), 29.2)).toBeTruthy();
    expect(inDelta(interpolator(0.7), 32.4)).toBeTruthy();
    expect(inDelta(interpolator(0.8), 35.6)).toBeTruthy();
    expect(inDelta(interpolator(0.9), 38.8)).toBeTruthy();
    expect(inDelta(interpolator(1.0), 42.0)).toBeTruthy();
  });
});
