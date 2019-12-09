export function isEqualAsJson<AType, BType>(a: AType, b: BType): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
