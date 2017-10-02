function interpolateNumber (a, b) {
  const numericA = Number(a);
  let numericB = Number(b);

  numericB -= numericA;

  return t => numericA + (numericB * t);
}

export default interpolateNumber;
