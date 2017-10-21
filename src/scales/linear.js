import reinterpolate from '../utils/interpolators/number';
import ScaleContinuous, { copy, deinterpolateLinear as deinterpolate } from './continuous';

class ScaleLinear extends ScaleContinuous {
  copy () {
    return copy(this, new ScaleLinear(deinterpolate, reinterpolate));
  }
}

export default ScaleLinear;
