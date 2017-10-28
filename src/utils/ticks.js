const E10 = Math.sqrt(50),
      E5 = Math.sqrt(10),
      E2 = Math.sqrt(2);

function tickIncrement (start = 0, stop = 1, count = 7) {
  const step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / (10 ** power);

  let factor = 1,
      increment;

  if (error >= E10) {
    factor = 10;
  } else if (error >= E5) {
    factor = 5;
  } else if (error >= E2) {
    factor = 2;
  } else {
    factor = 1;
  }

  if (power >= 0) {
    increment = factor * (10 ** power);
  } else {
    increment = -(10 ** -power) / factor;
  }

  return increment;
}

function tickStep (start = 0, stop = 1, count = 7) {
  const step0 = Math.abs(stop - start) / Math.max(0, count);
  let step1 = 10 ** Math.floor(Math.log(step0) / Math.LN10);
  const error = step0 / step1;

  if (error >= E10) {
    step1 *= 10;
  } else if (error >= E5) {
    step1 *= 5;
  } else if (error >= E2) {
    step1 *= 2;
  }

  return stop < start ? -step1 : step1;
}

function ticks (start = 0, stop = 1, count = 7) {
  let i = 0,
      n,
      tickArr,
      numericStart = Number(start),
      numericStop = Number(stop),
      step = 0;

  const numericCount = Number(count),
        reverse = numericStop < numericStart;

  if (numericStart === numericStop && numericCount > 0) {
    return [numericStart];
  }

  if (reverse) {
    n = numericStart;
    numericStart = numericStop;
    numericStop = n;
  }

  step = tickIncrement(numericStart, numericStop, numericCount);

  if (step === 0 || !Number.isFinite(step)) {
    return [];
  }

  if (step > 0) {
    numericStart = Math.ceil(numericStart / step);
    numericStop = Math.floor(numericStop / step);
    n = Math.ceil((numericStop - numericStart) + 1);
    tickArr = new Array(n);
    while (i < n) {
      tickArr[i] = (numericStart + i) * step;
      i += 1;
    }
  } else {
    numericStart = Math.floor(numericStart * step);
    numericStop = Math.ceil(numericStop * step);
    n = Math.ceil((numericStart - numericStop) + 1);
    tickArr = new Array(n);

    while (i < n) {
      tickArr[i] = (numericStart - i) / step;
      i += 1;
    }
  }

  if (reverse) {
    tickArr.reverse();
  }

  return tickArr;
}

export default ticks;
export { tickIncrement, tickStep };
