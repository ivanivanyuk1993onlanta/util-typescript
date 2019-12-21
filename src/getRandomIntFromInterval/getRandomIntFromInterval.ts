// Todo move to folder, add tests, update doc to use jsdoc

// min and max inclusively
export function getRandomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
