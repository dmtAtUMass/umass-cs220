import { nonNegatives, nonNegatives2D, noNegativeRows } from "./lab.js";

describe("nonNegatives", () => {
  it("Negative numbers are filtered", () => {
    const input = [-1, 2, -3, 4];
    const expected_output = [2, 4];
    const output = nonNegatives(input);
    expect(output).toStrictEqual(expected_output);
  });

  it("Input of only negatives removes all", () => {
    const input = [-1, -2, -3, -4, -5, -6, -7, -8, -9];
    const expected_output: number[] = [];
    const output = nonNegatives(input);
    expect(output).toStrictEqual(expected_output);
  });
});

describe("nonNegatives2D", () => {
  it("Filters a 2D array correctly", () => {
    const input = [[0], [1, -2, 3, 4], [-1, -4, -7], [1, 2, 3, 4]];
    const expected_output = [[0], [1, 3, 4], [], [1, 2, 3, 4]];
    const output = nonNegatives2D(input);
    expect(output).toStrictEqual(expected_output);
  });
});

describe("noNegativeRows", () => {
  it("Filters a 2D array correctly", () => {
    const input = [[0], [1, -2, 3, 4], [-1, -4, -7], [1, 2, 3, 4]];
    const expected_output = [[0], [], [], [1, 2, 3, 4]];
    const output = noNegativeRows(input);
    expect(output).toStrictEqual(expected_output);
  });
});
