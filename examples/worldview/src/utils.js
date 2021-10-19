export const nearestEven = (num, decimalPlaces = 3) => {
  const factorTen = Math.pow(10, decimalPlaces);
  num = num * factorTen;
  num = 2 * Math.round(num / 2);
  return num / factorTen;
};

export function scale(startingSize, targetSize) {
  return Math.min(startingSize.width / targetSize.width, startingSize.height / targetSize.height);
}
