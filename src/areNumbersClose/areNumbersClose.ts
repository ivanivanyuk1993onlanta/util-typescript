export function areNumbersClose(number1: number, number2: number, allowedDifference: number): boolean {
  return number1 > number2 ? number1 - number2 <= allowedDifference : number2 - number1 <= allowedDifference;
}
