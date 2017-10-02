function interpolateRound (a, b) {
  const numericA = Number(a);
  let numericB = Number(b);

  numericB -= numericA;

  return t => Math.round(numericA + (numericB * t));
}

export default interpolateRound;
