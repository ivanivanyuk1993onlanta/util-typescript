export function getEnumMemberName<EnumMemberType>(
  enum2: any,
  enumMemberValue: EnumMemberType,
): string {
  return enum2[enumMemberValue];
}
