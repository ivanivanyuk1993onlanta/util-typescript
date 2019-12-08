export function isEqualAsScalarArray<Type>(arrayA: Type[], arrayB: Type[]) {
  return (
    arrayA.length === arrayB.length &&
    arrayA.every((value, index) => value === arrayB[index])
  );
}
