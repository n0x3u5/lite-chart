import interpolateNumber from './number';
import constant from '../constant';

function interpolateValue (from, to) {
  const type = typeof to;

  return to == null || type === 'boolean' ? constant(to)
    : (type === 'number' ? interpolateNumber : interpolateNumber)(from, to);
}

export default interpolateValue;
