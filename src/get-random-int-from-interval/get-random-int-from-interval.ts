// Todo move to folder, add tests

// min and max inclusively
export function getRandomIntFromInterval(
  min: number,
  max: number,
): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
