import ScaleTime from '../time';
import localDate from './date';
import timeMinute from '../../time/minute';
import timeDay from '../../time/day';
import timeWeek from '../../time/week';
import timeMonth from '../../time/month';
import timeYear from '../../time/year';

describe('A time scale should', () => {
  test('be unable to deal with invalidly massive domains', () => {
    const timeScale = new ScaleTime().setDomain([-1e50, 1e50]);

    // Note: also coerced on retrieval, so insufficient test!
    expect(Number(timeScale.getDomain()[0])).toBeNaN();
    expect(Number(timeScale.getDomain()[1])).toBeNaN();
    expect(timeScale.ticks(10)).toEqual([]);
  });

  describe('be able to nice', () => {
    test('by 10 units by default', () => {
      const timeScale = new ScaleTime()
        .setDomain([localDate(2009, 0, 1, 0, 17), localDate(2009, 0, 1, 23, 42)]);

      expect(timeScale.nice().getDomain()).toEqual([localDate(2009, 0, 1), localDate(2009, 0, 2)]);
    });

    describe('by a given number of time units', () => {
      test('correctly', () => {
        const timeScale = new ScaleTime().setDomain([
          localDate(2009, 0, 1, 0, 17),
          localDate(2009, 0, 1, 23, 42)
        ]);

        expect(timeScale.nice(100).getDomain()).toEqual([
          localDate(2009, 0, 1, 0, 15),
          localDate(2009, 0, 1, 23, 45)
        ]);

        expect(timeScale.nice(10).getDomain()).toEqual([
          localDate(2009, 0, 1),
          localDate(2009, 0, 2)
        ]);
      });

      test('at sub second level domains', () => {
        const timeScale = new ScaleTime().setDomain([
          localDate(2013, 0, 1, 12, 0, 0, 0),
          localDate(2013, 0, 1, 12, 0, 0, 128)
        ]);

        expect(timeScale.nice(10).getDomain()).toEqual([
          localDate(2013, 0, 1, 12, 0, 0, 0),
          localDate(2013, 0, 1, 12, 0, 0, 130)
        ]);
      });

      test('at multi year level domains', () => {
        const timeScale = new ScaleTime().setDomain([localDate(2001, 0, 1), localDate(2138, 0, 1)]);

        expect(timeScale.nice(10).getDomain()).toEqual([
          localDate(2000, 0, 1),
          localDate(2140, 0, 1)
        ]);
      });

      test('when domains are empty', () => {
        const timeScale = new ScaleTime().setDomain([
          localDate(2009, 0, 1, 0, 12),
          localDate(2009, 0, 1, 0, 12)
        ]);

        expect(timeScale.nice(10).getDomain()).toEqual([
          localDate(2009, 0, 1, 0, 12),
          localDate(2009, 0, 1, 0, 12)
        ]);
      });
    });
    describe('by a given of time interval', () => {
      test('correctly', () => {
        const x = new ScaleTime().setDomain([
          localDate(2009, 0, 1, 0, 12),
          localDate(2009, 0, 1, 23, 48)
        ]);

        expect(x.nice(timeDay).getDomain()).toEqual([
          localDate(2009, 0, 1),
          localDate(2009, 0, 2)
        ]);
        expect(x.nice(timeWeek).getDomain()).toEqual([
          localDate(2008, 11, 28),
          localDate(2009, 0, 4)
        ]);
        expect(x.nice(timeMonth).getDomain()).toEqual([
          localDate(2008, 11, 1),
          localDate(2009, 1, 1)
        ]);
        expect(x.nice(timeYear).getDomain()).toEqual([
          localDate(2008, 0, 1),
          localDate(2010, 0, 1)
        ]);
      });

      test('when domains are empty', () => {
        const timeScale = new ScaleTime().setDomain([
          localDate(2009, 0, 1, 0, 12),
          localDate(2009, 0, 1, 0, 12)
        ]);

        expect(timeScale.nice(timeDay).getDomain()).toEqual([
          localDate(2009, 0, 1),
          localDate(2009, 0, 2)
        ]);
      });

      test('when the domain is polylinear, only affecting its extent', () => {
        const timeScale = new ScaleTime().setDomain([
          localDate(2009, 0, 1, 0, 12),
          localDate(2009, 0, 1, 23, 48),
          localDate(2009, 0, 2, 23, 48)
        ]).nice(timeDay);

        expect(timeScale.getDomain()).toEqual([
          localDate(2009, 0, 1),
          localDate(2009, 0, 1, 23, 48),
          localDate(2009, 0, 3)
        ]);
      });
    });

    test('by the specified time interval and step', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2009, 0, 1, 0, 12),
        localDate(2009, 0, 1, 23, 48)
      ]);

      expect(timeScale.nice(timeDay, 3).getDomain()).toEqual([
        localDate(2009, 0, 1),
        localDate(2009, 0, 4)
      ]);
      expect(timeScale.nice(timeWeek, 2).getDomain()).toEqual([
        localDate(2008, 11, 21),
        localDate(2009, 0, 4)
      ]);
      expect(timeScale.nice(timeMonth, 3).getDomain()).toEqual([
        localDate(2008, 9, 1),
        localDate(2009, 3, 1)
      ]);
      expect(timeScale.nice(timeYear, 10).getDomain()).toEqual([
        localDate(2000, 0, 1),
        localDate(2010, 0, 1)
      ]);
    });
  });

  describe('be able to copy itself', () => {
    test('such that changes to its domain does not affect the copied scale\'s domain', () => {
      const x = new ScaleTime().setDomain([localDate(2009, 0, 1), localDate(2010, 0, 1)]),
            y = x.copy();

      x.setDomain([localDate(2010, 0, 1), localDate(2011, 0, 1)]);
      expect(x.getRangeForDomain(localDate(2010, 0, 1))).toBe(0);
      expect(y.getRangeForDomain(localDate(2010, 0, 1))).toBe(1);
      expect(y.getDomain()).toEqual([localDate(2009, 0, 1), localDate(2010, 0, 1)]);

      y.setDomain([localDate(2011, 0, 1), localDate(2012, 0, 1)]);
      expect(x.getRangeForDomain(localDate(2011, 0, 1))).toBe(1);
      expect(y.getRangeForDomain(localDate(2011, 0, 1))).toBe(0);

      expect(x.getDomain()).toEqual([localDate(2010, 0, 1), localDate(2011, 0, 1)]);
      expect(y.getDomain()).toEqual([localDate(2011, 0, 1), localDate(2012, 0, 1)]);
    });

    test('such that changes to its range does not affect the copied scale\'s range', () => {
      const x = new ScaleTime().setDomain([localDate(2009, 0, 1), localDate(2010, 0, 1)]),
            y = x.copy();

      x.setRange([1, 2]);
      expect(x.getDomainForRange(1)).toEqual(localDate(2009, 0, 1));
      expect(y.getDomainForRange(1)).toEqual(localDate(2010, 0, 1));
      expect(y.getRange()).toEqual([0, 1]);

      y.setRange([2, 3]);
      expect(x.getDomainForRange(2)).toEqual(localDate(2010, 0, 1));
      expect(y.getDomainForRange(2)).toEqual(localDate(2009, 0, 1));
      expect(x.getRange()).toEqual([1, 2]);
      expect(y.getRange()).toEqual([2, 3]);
    });

    test('such that changes to its interpolator is isolated from the copied scale', () => {
      const x = new ScaleTime().setDomain([
              localDate(2009, 0, 1),
              localDate(2010, 0, 1)
            ]).setRange([1, 10]),
            i = x.getInterpolator(),
            y = x.copy();

      x.setInterpolator(() => () => 5);
      expect(x.getRangeForDomain(localDate(2009, 6, 1))).toBe(5);
      expect(y.getRangeForDomain(localDate(2009, 6, 1))).toBeCloseTo(5, 0);
      expect(y.getInterpolator()).toEqual(i);
    });

    test('such that changes to its clamping is isolated from the copied scale', () => {
      const x = new ScaleTime().setDomain([localDate(2009, 0, 1), localDate(2010, 0, 1)])
              .setClamp(true),
            y = x.copy();

      x.setClamp(false);
      expect(x.getRangeForDomain(localDate(2011, 0, 1))).toBe(2);
      expect(y.getRangeForDomain(localDate(2011, 0, 1))).toBe(1);
      expect(y.getClamp()).toBeTruthy();

      y.setClamp(false);
      expect(x.getRangeForDomain(localDate(2011, 0, 1))).toBe(2);
      expect(y.getRangeForDomain(localDate(2011, 0, 1))).toBe(2);
      expect(x.getClamp()).toBeFalsy();
    });
  });

  test('never return a value outside its domain when clamped', () => {
    const timeScale = new ScaleTime().setClamp(true);

    expect(timeScale.getDomainForRange(0)).toBeInstanceOf(Date);

    // returns a newly constucted Date object every time
    expect(timeScale.getDomainForRange(0)).not.toBe(timeScale.getDomainForRange(0));

    expect(+timeScale.getDomainForRange(-1)).toEqual(+timeScale.getDomain()[0]);
    expect(+timeScale.getDomainForRange(0)).toEqual(+timeScale.getDomain()[0]);
    expect(+timeScale.getDomainForRange(1)).toEqual(+timeScale.getDomain()[1]);
    expect(+timeScale.getDomainForRange(2)).toEqual(+timeScale.getDomain()[1]);
  });

  describe('be able to generate ticks', () => {
    test('at the specified tick intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 1, 0),
        localDate(2011, 0, 1, 12, 4, 4)
      ]);

      expect(timeScale.ticks(timeMinute)).toEqual([
        localDate(2011, 0, 1, 12, 1),
        localDate(2011, 0, 1, 12, 2),
        localDate(2011, 0, 1, 12, 3),
        localDate(2011, 0, 1, 12, 4)
      ]);
    });

    test('at the specified tick intervals and steps', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 33, 4)
      ]);

      expect(timeScale.ticks(timeMinute, 10)).toEqual([
        localDate(2011, 0, 1, 12, 0),
        localDate(2011, 0, 1, 12, 10),
        localDate(2011, 0, 1, 12, 20),
        localDate(2011, 0, 1, 12, 30)
      ]);
    });

    test('at sub-second intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 1)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 0, 0, 0),
        localDate(2011, 0, 1, 12, 0, 0, 200),
        localDate(2011, 0, 1, 12, 0, 0, 400),
        localDate(2011, 0, 1, 12, 0, 0, 600),
        localDate(2011, 0, 1, 12, 0, 0, 800),
        localDate(2011, 0, 1, 12, 0, 1, 0)
      ]);
    });

    test('at 1-second intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 4)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 1),
        localDate(2011, 0, 1, 12, 0, 2),
        localDate(2011, 0, 1, 12, 0, 3),
        localDate(2011, 0, 1, 12, 0, 4)
      ]);
    });

    test('at 5-second intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 20)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 5),
        localDate(2011, 0, 1, 12, 0, 10),
        localDate(2011, 0, 1, 12, 0, 15),
        localDate(2011, 0, 1, 12, 0, 20)
      ]);
    });

    test('at 15-second intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 50)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 15),
        localDate(2011, 0, 1, 12, 0, 30),
        localDate(2011, 0, 1, 12, 0, 45)
      ]);
    });

    test('at 30-second intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 1, 50)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 0, 0),
        localDate(2011, 0, 1, 12, 0, 30),
        localDate(2011, 0, 1, 12, 1, 0),
        localDate(2011, 0, 1, 12, 1, 30)
      ]);
    });

    test('at 1-minute intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 0, 27),
        localDate(2011, 0, 1, 12, 4, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 1),
        localDate(2011, 0, 1, 12, 2),
        localDate(2011, 0, 1, 12, 3),
        localDate(2011, 0, 1, 12, 4)
      ]);
    });

    test('at 5-minute intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 3, 27),
        localDate(2011, 0, 1, 12, 21, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 5),
        localDate(2011, 0, 1, 12, 10),
        localDate(2011, 0, 1, 12, 15),
        localDate(2011, 0, 1, 12, 20)
      ]);
    });

    test('at 15-minute intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 8, 27),
        localDate(2011, 0, 1, 13, 4, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 15),
        localDate(2011, 0, 1, 12, 30),
        localDate(2011, 0, 1, 12, 45),
        localDate(2011, 0, 1, 13, 0)
      ]);
    });

    test('at 30-minute intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 28, 27),
        localDate(2011, 0, 1, 14, 4, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 12, 30),
        localDate(2011, 0, 1, 13, 0),
        localDate(2011, 0, 1, 13, 30),
        localDate(2011, 0, 1, 14, 0)
      ]);
    });

    test('at 1-hour intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 12, 28, 27),
        localDate(2011, 0, 1, 16, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 13, 0),
        localDate(2011, 0, 1, 14, 0),
        localDate(2011, 0, 1, 15, 0),
        localDate(2011, 0, 1, 16, 0)
      ]);
    });

    test('at 3-hour intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 14, 28, 27),
        localDate(2011, 0, 2, 1, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 15, 0),
        localDate(2011, 0, 1, 18, 0),
        localDate(2011, 0, 1, 21, 0),
        localDate(2011, 0, 2, 0, 0)
      ]);
    });

    test('at 6-hour intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 16, 28, 27),
        localDate(2011, 0, 2, 14, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 18, 0),
        localDate(2011, 0, 2, 0, 0),
        localDate(2011, 0, 2, 6, 0),
        localDate(2011, 0, 2, 12, 0)
      ]);
    });

    test('at 12-hour intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 16, 28, 27),
        localDate(2011, 0, 3, 21, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 2, 0, 0),
        localDate(2011, 0, 2, 12, 0),
        localDate(2011, 0, 3, 0, 0),
        localDate(2011, 0, 3, 12, 0)
      ]);
    });

    test('at 1-day intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 16, 28, 27),
        localDate(2011, 0, 5, 21, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 2, 0, 0),
        localDate(2011, 0, 3, 0, 0),
        localDate(2011, 0, 4, 0, 0),
        localDate(2011, 0, 5, 0, 0)
      ]);
    });

    test('at 2-day intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 2, 16, 28, 27),
        localDate(2011, 0, 9, 21, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 3, 0, 0),
        localDate(2011, 0, 5, 0, 0),
        localDate(2011, 0, 7, 0, 0),
        localDate(2011, 0, 9, 0, 0)
      ]);
    });

    test('at 1-week intervals', () => {
      const timeScale = new ScaleTime().setDomain([
        localDate(2011, 0, 1, 16, 28, 27),
        localDate(2011, 0, 23, 21, 34, 12)
      ]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 2, 0, 0),
        localDate(2011, 0, 9, 0, 0),
        localDate(2011, 0, 16, 0, 0),
        localDate(2011, 0, 23, 0, 0)
      ]);
    });

    test('at 1-month intervals', () => {
      const timeScale = new ScaleTime().setDomain([localDate(2011, 0, 18), localDate(2011, 4, 2)]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 1, 1, 0, 0),
        localDate(2011, 2, 1, 0, 0),
        localDate(2011, 3, 1, 0, 0),
        localDate(2011, 4, 1, 0, 0)
      ]);
    });

    test('at 3-month intervals', () => {
      const timeScale = new ScaleTime().setDomain([localDate(2010, 11, 18), localDate(2011, 10, 2)]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 0, 0),
        localDate(2011, 3, 1, 0, 0),
        localDate(2011, 6, 1, 0, 0),
        localDate(2011, 9, 1, 0, 0)
      ]);
    });

    test('at 1-year intervals', () => {
      const timeScale = new ScaleTime().setDomain([localDate(2010, 11, 18), localDate(2014, 2, 2)]);

      expect(timeScale.ticks(4)).toEqual([
        localDate(2011, 0, 1, 0, 0),
        localDate(2012, 0, 1, 0, 0),
        localDate(2013, 0, 1, 0, 0),
        localDate(2014, 0, 1, 0, 0)
      ]);
    });

    test('at multi-year intervals', () => {
      const timeScale = new ScaleTime().setDomain([localDate(0, 11, 18), localDate(2014, 2, 2)]);

      expect(timeScale.ticks(6)).toEqual([
        localDate(500, 0, 1, 0, 0),
        localDate(1000, 0, 1, 0, 0),
        localDate(1500, 0, 1, 0, 0),
        localDate(2000, 0, 1, 0, 0)
      ]);
    });
  });

  test('be able to generate descending ticks for a descending domain', () => {
    const timeScale = new ScaleTime();

    expect(timeScale.setDomain([
      localDate(2014, 2, 2),
      localDate(2010, 11, 18)
    ]).ticks(4)).toEqual([
      localDate(2014, 0, 1, 0, 0),
      localDate(2013, 0, 1, 0, 0),
      localDate(2012, 0, 1, 0, 0),
      localDate(2011, 0, 1, 0, 0)
    ]);

    expect(timeScale.setDomain([
      localDate(2011, 10, 2),
      localDate(2010, 11, 18)
    ]).ticks(4)).toEqual([
      localDate(2011, 9, 1, 0, 0),
      localDate(2011, 6, 1, 0, 0),
      localDate(2011, 3, 1, 0, 0),
      localDate(2011, 0, 1, 0, 0)
    ]);
  });

  test('not be able to generate ticks if the domain is empty', () => {
    const timeScale = new ScaleTime().setDomain([localDate(2014, 2, 2), localDate(2014, 2, 2)]);

    expect(timeScale.ticks(6)).toEqual([]);
  });
});
