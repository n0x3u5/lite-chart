class Axis {
  constructor () {
    this.config = {};
    this.graphics = {
      line: {},
      ticks: {}
    };
    this.store = {};

    this.setValuePadding();
    this.setOrientation();
  }

  setOrientation (orientation = 'bottom') {
    this.orientation = orientation;

    return this;
  }
  getOrientation () {
    return this.orientation;
  }

  setValuePadding (valuePadding = 0) {
    this.config.valuePadding = valuePadding;

    return this;
  }
  getValuePadding () {
    return this.config.valuePadding;
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

    const domain = scale.getDomain(),
          orientation = this.getOrientation(),
          valuePadding = this.getValuePadding(),
          domainInterval = Math.abs(domain[0] - domain[1]),
          domainStart = domain[0] - (domainInterval * valuePadding),
          domainEnd = domain[domain.length - 1] + (domainInterval * valuePadding),
          { graphics } = this,
          painterBox = painter.viewbox(),
          painterStartX = painterBox.x,
          painterEndY = painterBox.height - painterBox.y;

    if (orientation === 'bottom') {
      graphics.line = painter.line().plot(
        domainStart,
        painterEndY - 50,
        domainEnd,
        painterEndY - 50
      ).attr({
        stroke: '#000000'
      });

      graphics.ticks = domain.map(element => painter.circle().radius(2).attr({
        fill: '#000',
        cx: element,
        cy: painterEndY - 50
      }));
    } else if (orientation === 'left') {
      graphics.line = painter.line().plot(
        painterStartX + 50,
        domainStart,
        painterStartX + 50,
        domainEnd
      ).attr({
        stroke: '#000000'
      });

      graphics.ticks = domain.map(element => painter.circle().radius(2).attr({
        fill: '#000',
        cx: painterStartX + 50,
        cy: element
      }));
    }
  }
}

export default Axis;
