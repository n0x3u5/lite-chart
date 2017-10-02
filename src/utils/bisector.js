import ascending from './comparators/ascending';

const ascendingComparator = f => (d, x) => ascending(f(d), x),
      bisector = (compareFn) => {
        let compare = compareFn;

        if (compare.length === 1) {
          compare = ascendingComparator(compare);
        }

        return {
          left: (arr = [], x, lo = 0, hi = arr.length) => {
            let low = lo,
                high = hi;

            while (low < high) {
              const mid = Math.abs(Math.floor((low + high) / 2));

              if (compare(arr[mid], x) < 0) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }

            return low;
          },
          right: (arr = [], x, lo = 0, hi = arr.length) => {
            let low = lo,
                high = hi;

            while (low < high) {
              const mid = Math.abs(Math.floor((low + high) / 2));

              if (compare(arr[mid], x) > 0) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }

            return low;
          }
        };
      };

export default bisector;
