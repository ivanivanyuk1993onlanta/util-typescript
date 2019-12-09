export function getEnumMemberName<EnumType, EnumMemberType>(
  enum2: EnumType,
  enumMemberValue: EnumMemberType
): string {
  return (enum2 as any)[enumMemberValue] as string;
}
