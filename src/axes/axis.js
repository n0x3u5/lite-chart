const TOP = 1,
      RIGHT = 2,
      BOTTOM = 3,
      LEFT = 4,
      translateX = x => `translate(${x + 0.5}, 0)`,
      translateY = y => `translate(0, ${y + 0.5})`,
      center = (scale) => {
        // Adjusting for 0.5 px offset effect
        let offset = Math.max(0, scale.getBandwidth() - 1) / 2;

        if (scale.getRound()) offset = Math.round(offset);

        return d => Number(scale.getRangeForDomain(d)) + offset;
      },
      number = scale => domain => scale.getRangeForDomain(domain);

class Axis {
  constructor (orient, scale) {
    this.orient = orient;
    this.scale = scale;
    this.tickArguments = [];
    this.tickValues = null;
    this.tickSizeInner = 6;
    this.tickSizeOuter = 6;
    this.tickPadding = 3;
    this.k = this.orient === TOP || this.orient === LEFT ? -1 : 1;
    this.x = this.orient === LEFT || this.orient === RIGHT ? 'x' : 'y';
    this.xInverse = this.orient === LEFT || this.orient === RIGHT ? 'y' : 'x';
    this.transform = this.orient === TOP || this.orient === BOTTOM ? translateX : translateY;
  }

  draw (painter) {
    if (this.tickValues == null) {
      if (this.scale.ticks) {
        this.values = this.scale.ticks(...this.tickArguments);
      } else {
        this.values = this.scale.getDomain();
      }
    } else {
      this.values = this.tickValues;
    }
    this.spacing = Math.max(this.tickSizeInner, 0) + this.tickPadding;
    this.range = this.scale.getRange();
    this.range0 = Number(this.range[0]) + 0.5;
    this.range1 = Number(this.range[this.range.length - 1]) + 0.5;
    this.position = ((this.scale.getBandwidth || this.scale.setBandwidth)
      ? center
      : number)(this.scale.copy());

    if (!this.container) {
      this.container = painter.group().attr({
        fill: 'none',
        'font-size': 10,
        // eslint-disable-next-line
        'text-anchor': this.orient === RIGHT ? 'start' : this.orient === LEFT ? 'end' : 'middle'
      });
    }

    if (!this.line) {
      this.line = this.container.path()
        .stroke({
          color: '#000000',
        })
        .addClass('domain')
        .style('shape-rendering', 'crispEdges');
    }

    this.line.plot(this.orient === LEFT || this.orient === RIGHT
      ? `M ${0} ${this.range0} V ${this.range1}`
      : `M ${this.range0} ${0} H ${this.range1}`);

    this.ticks = this.values.map((value) => {
      const pos = this.position(value),
            tickGroup = this.container.group().addClass('tick').attr({
              opacity: 1
            });

      tickGroup.line()
        .attr(`${this.xInverse}1`, pos)
        .attr(`${this.x}1`, 0)
        .attr(`${this.xInverse}2`, pos)
        .attr(`${this.x}2`, this.k * this.tickSizeInner)
        .stroke({
          color: '#000000'
        })
        .style('shape-rendering', 'crispEdges');

      tickGroup.text(value.toString())
        .attr(this.x, this.k * this.spacing)
        .attr(this.xInverse, pos)
        .fill({
          color: '#000000'
        })
        .lines()
        // eslint-disable-next-line
        .attr('dy', this.orient === TOP ? '0em' : this.orient === BOTTOM ? '0.71em' : '0.32em');

      return tickGroup;
    });
  }
}

class AxisTop extends Axis {
  constructor (scale) {
    super(TOP, scale);
  }
}

class AxisRight extends Axis {
  constructor (scale) {
    super(RIGHT, scale);
  }
}

class AxisBottom extends Axis {
  constructor (scale) {
    super(BOTTOM, scale);
  }
}

class AxisLeft extends Axis {
  constructor (scale) {
    super(LEFT, scale);
  }
}


export { AxisTop, AxisRight, AxisBottom, AxisLeft };
