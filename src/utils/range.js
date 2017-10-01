const range = (...params) => {
  let i = 0,
      start,
      stop,
      step;

  if (params.length < 2) {
    start = 0;
    stop = Number(params[0]);
    step = 1;
  } else if (params.length < 3) {
    start = Number(params[0]);
    stop = Number(params[1]);
    step = 1;
  } else {
    start = Number(params[0]);
    stop = Number(params[1]);
    step = Number(params[2]);
  }

  const n = Math.floor(Math.max(0, Math.ceil((stop - start) / step))),
        rangeArr = (Number.isNaN(n) || n === Infinity || n === -Infinity)
          ? new Array(0)
          : new Array(n);

  while (i < rangeArr.length) {
    rangeArr[i] = start + (i * step);
    i += 1;
  }

  return rangeArr;
};

export default range;
