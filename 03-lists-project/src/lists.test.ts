import assert from "assert";
import { arrayToList, listToArray } from "../include/lists.js";
import {
  everyNList,
  everyNRev,
  everyNCond,
  nonNegativeProducts,
  negativeProducts,
  squashList,
  composeList,
  composeFunctions,
} from "./lists.js";

describe("everyNList", () => {
  // Tests for everyNList go here
  it("should return the correct list every 3 indexes", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    const lst = arrayToList(array);
    const filtered = everyNList(lst, 3);
    expect(filtered.head()).toEqual(3);
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here
  it("should returm every 3 indexes of the list but in reverse order", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const filtered = everyNRev(lst, 3);
    expect(listToArray(filtered)).toEqual([9, 6, 3]);
  });
});

describe("everyNCond", () => {
  it("should return the correct even numbers every 2 indexes", () => {
    const lst = arrayToList([1, 3, 5, 2, 1, 1, 2, 3, 3, 4, 4, 5, 5]);
    const output = everyNCond(lst, 2, e => e % 2 == 0);
    assert(listToArray(output)[0] === 2);
    assert(listToArray(output)[1] === 4);
    assert(listToArray(output).length === 2);
  });
});

describe("nonNegativeProducts", () => {
  it("should return the correct described unit test for non-negatives", () => {
    const lst = arrayToList([2, 3, -1, 0.5, 2]);
    const output = nonNegativeProducts(lst);
    expect(listToArray(output)).toEqual([2, 6, 0.5, 1]);
  });
});

describe("negativeProducts", () => {
  it("should return the correct provided unit test for negatives", () => {
    const lst = arrayToList([-3, -6, 2, -2, -1, -2]);
    const output = negativeProducts(lst);
    expect(listToArray(output)).toEqual([-3, 18, -2, 2, -4]);
  });
});

describe("squashList", () => {
  it("should return the correct squashed list", () => {
    const nest1 = arrayToList([1, 2, 3]);
    const lst = arrayToList([1, 2, nest1]);
    const output = squashList(lst);
    expect(listToArray(output)).toEqual([1, 2, 6]);
  });
});

describe("composeList", () => {
  it("should return the correct nested function", () => {
    const lst = arrayToList([(x: number) => x ** 2, (x: number) => x + 2, (x: number) => x / 3]);
    const output = composeList(lst);
    expect(output(4)).toEqual(6);
    expect(output(7)).toEqual(17);
    expect(Math.floor(output(9))).toEqual(27);
  });
});

describe("composeFunctions", () => {
  it("should return the correct closure", () => {
    const f = (x: number, y: number) => x ** 2 + y;
    const g = (x: number, y: number) => x + 2 + y;
    const h = (x: number, y: number) => x / 2 + y;
    const output = composeFunctions([f, g, h]);
    expect(output(1)(4)).toEqual(11);
    expect(output(2)(4)).toEqual(13);
  });
});
