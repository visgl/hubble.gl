export const nearestEvenInt = num => 2 * Math.round(num / 2);

export const nearestEvenFloat = num => {
  num = num * 1000;
  num = 2 * Math.round(num / 2);
  return num / 1000;
};
