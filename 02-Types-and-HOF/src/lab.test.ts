import { mainlyBlue, mainlyBlue2D, sumLog } from "./lab.js";

type Color = [number, number, number];

describe("mainlyBlue", () => {
  it("Works correctly", () => {
    const input: Color[] = [
      [1, 1, 50],
      [1, 50, 50],
      [50, 1, 50],
      [40, 40, 81],
    ];
    const expected_output = 2;
    const output = mainlyBlue(input);
    expect(output).toEqual(expected_output);
  });
});

describe("mainlyBlue2D", () => {
  it("Works correctly", () => {
    const input: Color[][] = [
      [
        [1, 1, 50],
        [1, 50, 50],
        [50, 1, 50],
        [40, 40, 81],
      ],
      [
        [3, 40, 50],
        [1, 50, 50],
        [50, 1, 50],
        [40, 40, 81],
      ],
    ];
    const expected_output = 3;
    const output = mainlyBlue2D(input);
    expect(output).toEqual(expected_output);
  });
});

describe("sumLog", () => {
  it("Works correctly", () => {
    const input = [-1, 0, 2, 10, -5];
    const expected_output = 2.9957;
    const output = sumLog(input);
    expect(output).toBeCloseTo(expected_output);
  });
});
