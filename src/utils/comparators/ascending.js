const ascending = (a, b) => {
  let result = NaN;

  if (a < b) {
    result = -1;
  } else if (a > b) {
    result = 1;
  } else if (a >= b) {
    result = 0;
  }

  return result;
};

export default ascending;
