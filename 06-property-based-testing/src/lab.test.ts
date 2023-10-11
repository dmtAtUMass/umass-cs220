import { AssertionError } from "assert";
import { FLAWED_GEN_ARRAY_SOLUTIONS, GEN_ARRAY_SOLUTIONS } from "../include/genArray.js";
import { oracle } from "./lab.js";

describe("stableMatchingOracle", () => {
  for (let i = 0; i < GEN_ARRAY_SOLUTIONS.length; i++) {
    const f = GEN_ARRAY_SOLUTIONS[i];

    it(`accepts STABLE_MATCHING_SOLUTION_${i + 1}`, () => {
      expect(() => oracle(f)).not.toThrow();
    });
  }

  for (let i = 0; i < FLAWED_GEN_ARRAY_SOLUTIONS.length; i++) {
    const f = FLAWED_GEN_ARRAY_SOLUTIONS[i];

    it(`rejects FLAWED_STABLE_MATCHING_SOLUTION_${i + 1}`, () => {
      expect(() => oracle(f)).toThrow(AssertionError);
    });
  }
});
