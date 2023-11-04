// import assert from "assert";
import { Observable } from "../include/observable.js";
import {
  classifyObservables,
  obsStrCond,
  statefulObserver,
  mergeMax,
  merge,
  GreaterAvgObservable,
  SignChangeObservable,
} from "./observables.js";

describe("classifyObservables", () => {
  it("classifies a number observable", () => {
    const o = new Observable<number>();
    const { number } = classifyObservables([o]);
    const spy = jest.fn();
    number.subscribe(spy);
    o.update(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("classifies a string observable", () => {
    const o = new Observable<string>();
    const { string } = classifyObservables([o]);
    const spy = jest.fn();
    string.subscribe(spy);
    o.update("hello world!");
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("classifies a mix of multiple observables", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<number>();
    const o3 = new Observable<boolean>();
    const { string, number, boolean } = classifyObservables([o1, o2, o3]);
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
    string.subscribe(spy1);
    number.subscribe(spy2);
    boolean.subscribe(spy3);
    o1.update("HI!");
    o2.update(3);
    o2.update(2);
    o3.update(true);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy3).toHaveBeenCalledTimes(1);
  });
});

describe("obsStrCond", () => {
  it("simple strings with simple condidtions", () => {
    const f1 = (x: string) => x + "3";
    const f = (x: string) => x.length < 4;
    const o = new Observable<string>();
    const cond = obsStrCond([f1], f, o);
    const spy = jest.fn();
    cond.subscribe(spy);
    o.update("a");
    expect(spy).toHaveBeenCalledWith("a3");
    o.update("abc");
    expect(spy).toHaveBeenCalledWith("abc");
  });
});

describe("statefulObserver", () => {
  it("simple test with simple conditions", () => {
    const o = new Observable<number>();
    const state = statefulObserver(o);
    const spy = jest.fn();
    state.subscribe(spy);
    o.update(2);
    o.update(1);
    expect(spy).toHaveBeenCalledTimes(0);
    o.update(3);
    expect(spy).toHaveBeenCalledTimes(1);
    o.update(6);
    o.update(12);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});

describe("mergeMax", () => {
  it("should udpate every time a new max is found", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const o3 = mergeMax(o1, o2);
    const spy = jest.fn();
    o3.subscribe(spy);
    const arr1 = [1, 3, 4, 5, 6];
    const arr2 = [2, 2, 7, 4, 4];
    const counter = [0, 1, 2, 3, 4];
    counter.forEach(e => {
      o1.update(arr1[e]);
      o2.update(arr2[e]);
    });
    expect(spy).toHaveBeenCalledTimes(5);
  });
});

describe("merge", () => {
  it("should only update when signs changes", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<string>();
    const o3 = merge(o1, o2);
    const spy = jest.fn();
    o3.subscribe(spy);
    const arr1 = ["a", "b", "c", "d", "e"];
    const arr2 = ["f", "g", "h", "i", "j"];
    const counter = [0, 1, 2, 3, 4];
    counter.forEach(e => {
      o1.update(arr1[e]);
      o2.update(arr2[e]);
    });
    expect(spy).toHaveBeenCalledTimes(10);
  });
});

describe("GreaterAvgObservable", () => {
  it("should correctly capture numbers geq  50% average", () => {
    const o = new GreaterAvgObservable();
    const o1 = o.greaterAvg();
    const spy = jest.fn();
    o1.subscribe(spy);
    o.update(1);
  });
});

describe("SignChangeObservable", () => {
  it("should only update when signs changes", () => {
    const o = new SignChangeObservable();
    const o1 = o.signChange();
    const arr = [1, 0, 1, 1, -1, -2, -3, 1];
    const spy = jest.fn();
    o1.subscribe(spy);
    // o1.subscribe(console.log);
    arr.forEach(e => o.update(e));
    expect(spy).toHaveBeenCalledTimes(4);
  });
});

describe("usingSignChange", () => {
  it("should only update when signs changes", () => {
    const o = new SignChangeObservable();
    const o1 = o.signChange();
    const f = (x: number) => 2 * x;
    const arr = [1, 0, 1, 1, -1, -2, -3, 1];
    const spy = jest.fn();
    o1.subscribe(spy);
    o1.subscribe(f);
    arr.forEach(e => o.update(e));
    expect(spy).toHaveBeenCalledTimes(4);
  });
});
