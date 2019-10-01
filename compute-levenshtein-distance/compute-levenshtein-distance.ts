export function computeLevenshteinDistance(leftString: string, rightString: string): number {
  let shorterString: string;
  let longerString: string;
  if (leftString.length < rightString.length) {
    shorterString = leftString;
    longerString = rightString;
  } else {
    shorterString = rightString;
    longerString = leftString;
  }

  if (shorterString.length === 0) {
    return longerString.length;
  }

  let costList = new Array<number>(shorterString.length + 1);
  let newCostList = new Array<number>(shorterString.length + 1);

  for (let shorterStringIndex = 0; shorterStringIndex <= shorterString.length; shorterStringIndex++) {
    costList[shorterStringIndex] = shorterStringIndex;
  }

  for (let longerStringIndex = 1; longerStringIndex <= longerString.length; longerStringIndex++) {
    newCostList[0] = longerStringIndex;
    for (let shorterStringIndex = 1; shorterStringIndex <= shorterString.length; shorterStringIndex++) {
      newCostList[shorterStringIndex] = Math.min(
        costList[shorterStringIndex - 1] + (longerString[longerStringIndex - 1] !== shorterString[shorterStringIndex - 1] ? 1 : 0), // substitution
        costList[shorterStringIndex] + 1, // deletion
        newCostList[shorterStringIndex - 1] + 1, // insertion
      );
    }
    [costList, newCostList] = [newCostList, costList];
  }

  return costList[shorterString.length];
}
