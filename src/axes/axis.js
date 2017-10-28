const TOP = 1,
      RIGHT = 2,
      BOTTOM = 3,
      LEFT = 4,
      // EPSILON = 1e-6,
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
    this.transform = this.orient === TOP || this.orient === BOTTOM ? translateX : translateY;
  }

  draw (painter) {
    if (this.tickValues == null) {
      if (this.scale.getTicks) {
        this.values = this.scale.getTicks(this.scale, this.tickArguments);
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
      this.container = painter.group();
    }

    painter.path('M20,30,L,40,40');

    // this.selection = context.selection ? context.selection() : context,
    // this.path = selection.selectAll(".domain").data([null]),
    // this.tick = selection.selectAll(".tick").data(values, scale).order(),
    // this.tickExit = tick.exit(),
    // this.tickEnter = tick.enter().append("g").attr("class", "tick"),
    // this.line = tick.select("line"),
    // this.text = tick.select("text");
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
