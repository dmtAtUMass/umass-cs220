import assert from "assert";

import type { Hire, StableMatcher, StableMatcherWithTrace } from "../include/stableMatching.js";

function generateRandomN(n: number): number[] {
  const output = new Array<number>(n).fill(-1);
  for (let i = 0; i < n; ++i) {
    let random = Math.floor(Math.random() * n);
    while (output[random] !== -1) {
      random = Math.floor(Math.random() * n);
    }
    output[random] = i;
  }
  return output;
}

export function generateInput(n: number): number[][] {
  const output: number[][] = new Array<number[]>(n).fill([]);
  for (let i = 0; i < n; ++i) {
    output[i] = generateRandomN(n);
  }
  return output;
}

function getIdx(arr: number[], value: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i;
    }
  }
  return -1;
}

function inRange(number: number, min: number, max: number): boolean {
  return min <= number && number < max;
}

function isStable(companies: number[][], candidates: number[][], hire1: Hire, hire2: Hire): boolean {
  const cand1 = hire1.candidate,
    cand2 = hire2.candidate,
    comp1 = hire1.company,
    comp2 = hire2.company;
  // return !((getIdx(companies[comp1], cand2) < getIdx(companies[comp1], cand1) && getIdx(candidates[cand2], comp1) < getIdx(candidates[cand2], comp2)) || (getIdx(companies[comp2], cand1) < getIdx(companies[comp2], cand2) && getIdx(candidates[cand1], comp2) < getIdx(candidates[cand1], comp1)) )
  return (
    getIdx(companies[comp1], cand2) < getIdx(companies[comp1], cand1) &&
    getIdx(candidates[cand2], comp1) < getIdx(candidates[cand2], comp2)
  );
}
const NUM_TESTS = 20; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size

/**
 * Tests whether or not the supplied function is a solution to the stable matching problem.
 * @param makeStableMatching A possible solution to the stable matching problem
 * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
 */
export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const hires = makeStableMatching(companies, candidates);

    assert(companies.length === hires.length, "Hires length is correct.");
    assert(candidates.length === hires.length, "Hires length is correct.");
    //assert candidates are all different
    assert(new Set(candidates).size === N, "Candidates are all different.");
    //assert companies are all different
    assert(new Set(companies).size === N, "Companies are all different.");
    // console.log(hires.forEach(e => inRange(e.candidate, 0, N) && inRange(e.company, 0, N)))
    assert(
      hires.every(e => inRange(e.candidate, 0, N) && inRange(e.company, 0, N)),
      "Hires are valid."
    );
    //assert stable matching property
    // console.log(hires.every(h1 => hires.every(h2 => !unstableMatching(companies, candidates, h1, h2))))
    assert(hires.every(h1 => hires.every(h2 => !isStable(companies, candidates, h1, h2))));
  }
}

// Part B

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    // This statement is here to prevent linter warnings about `trace` and `out` not being used.
    // Remove it as necessary.
    console.log(trace, out);

    // TODO: Assertions go here
  }
}
