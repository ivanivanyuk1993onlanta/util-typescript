import { computeLevenshteinDistance } from "../computeLevenshteinDistance";

describe("computeLevenshteinDistance", () => {
  it("computeLevenshteinDistance", () => {
    expect(computeLevenshteinDistance("sitting", "kitten")).toBe(3);
    expect(computeLevenshteinDistance("saturday", "sunday")).toBe(3);
    expect(computeLevenshteinDistance("day", "a")).toBe(2);
    expect(computeLevenshteinDistance("ячейки", "а")).toBe(6);
    expect(computeLevenshteinDistance("", "")).toBe(0);
    expect(computeLevenshteinDistance("", "1")).toBe(1);
  });
});
