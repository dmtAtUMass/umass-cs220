import { asyncPosMap } from "./lab.js";

describe("asyncPosMap", () => {
  it("works if call to f fulfills to a positive number", async () => {
    type T = string;
    const arrT: T[] = ["a", "b", "c"];
    const retNums = [1, 2, 3];
    const f = (_t: T) => Promise.resolve(retNums.shift());
    const res = await asyncPosMap(arrT, f as (f: T) => Promise<number>);
    expect(res).not.toBe(arrT);
    expect(res.sort()).toEqual(arrT);
    expect(arrT).toHaveLength(3);
  });

  it("works if call to f fulfills to a negative number", async () => {
    type T = string;
    const arrT: T[] = ["a", "b", "c"];
    const retNums = [-1, -2, -3];
    const f = (_t: T) => Promise.resolve(retNums.shift());
    const res = await asyncPosMap(arrT, f as (f: T) => Promise<number>);
    expect(res.sort()).toEqual([]);
    expect(arrT).toHaveLength(3);
  });

  it("works if call to f fulfills to zero", async () => {
    type T = string;
    const arrT: T[] = ["a", "b", "c"];
    const retNums = [0, 0, 0];
    const f = (_t: T) => Promise.resolve(retNums.shift());
    const res = await asyncPosMap(arrT, f as (f: T) => Promise<number>);
    expect(res.sort()).toEqual([]);
    expect(arrT).toHaveLength(3);
  });

  it("works with a mix of positive and non positive numbers", async () => {
    type T = string;
    const arrT: T[] = ["a", "b", "c"];
    const retNums = [-1, 0, 1];
    const f = (_t: T) => Promise.resolve(retNums.shift());
    const res = await asyncPosMap(arrT, f as (f: T) => Promise<number>);
    expect(res.sort()).toEqual(["c"]);
    expect(arrT).toHaveLength(3);
  });

  it("rejects if f rejects", () => {
    type T = string;
    const arrT: T[] = ["a", "b"];
    const retNums = [-1, 0, 1];
    const f = (t: T) => (t === "a" ? Promise.resolve(retNums.shift()) : Promise.reject("bad"));
    return expect(asyncPosMap(arrT, f as (f: T) => Promise<number>)).rejects.toBe("bad");
  });
});
