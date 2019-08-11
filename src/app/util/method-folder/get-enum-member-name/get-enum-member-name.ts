export function getEnumMemberName<EnumMemberType>(
  enum2: any,
  enumMember: EnumMemberType,
): string {
  return enum2[enumMember];
}
