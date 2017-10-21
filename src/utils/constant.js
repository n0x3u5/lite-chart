function constant (x) {
  return function () {
    return x;
  };
}

export default constant;
