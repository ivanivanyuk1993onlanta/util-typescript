export function isEqualAsScalarArray<Type>(
  arrayA: Type[],
  arrayB: Type[]
): boolean {
  return (
    arrayA.length === arrayB.length &&
    arrayA.every((value, index) => value === arrayB[index])
  );
}
