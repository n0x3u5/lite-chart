import ascending from './comparators/ascending';
import bisector from './bisector';

const ascendingBisector = bisector(ascending),
      bisectRight = ascendingBisector.right,
      bisectLeft = ascendingBisector.left;

export { bisectRight, bisectLeft };
export default bisectRight;
