import { getEnumMemberName } from "../getEnumMemberName";

describe("getEnumMemberName", () => {
  enum TestEnum {
    A,
    B
  }

  it("getEnumMemberName", () => {
    expect(getEnumMemberName(TestEnum, TestEnum.A)).toBe("A");
    expect(getEnumMemberName(TestEnum, TestEnum.B)).toBe("B");
  });
});
