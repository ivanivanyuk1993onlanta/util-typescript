export function isEqualAsJson<A, B>(
  a: A,
  b: B,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
