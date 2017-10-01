class Axis {
  constructor () {
    this.config = {};
    this.graphics = {
      line: {},
      ticks: {}
    };
    this.store = {};

    this.setOrientation();
  }

  setOrientation (orientation = 'bottom') {
    this.orientation = orientation;

    return this;
  }
  getOrientation () {
    return this.orientation;
  }

  setScale (scale) {
    this.store.scale = scale;

    return this;
  }
  getScale () {
    return this.store.scale;
  }

  setPainter (painter) {
    this.store.painter = painter;

    return this;
  }
  getPainter () {
    return this.store.painter;
  }

  draw () {
    const painter = this.getPainter(),
          scale = this.getScale();

    if (!painter || !scale) {
      return;
    }

    console.log('ya');
  }
}

export default Axis;
