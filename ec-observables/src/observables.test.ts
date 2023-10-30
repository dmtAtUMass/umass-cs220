import assert from "assert";
import { Observable, Observer } from "../include/observable.js";
import {
  classifyObservables,
  obsStrCond,
  statefulObserver,
  mergeMax,
  merge,
  GreaterAvgObservable,
  SignChangeObservable,
  usingSignChange,
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
    const f1 = (x: string) => x + 3;
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
  // More tests go here.
});

describe("merge", () => {
  // More tests go here.
});

describe("GreaterAvgObservable", () => {
  // More tests go here.
});

describe("SignChangeObservable", () => {
  // More tests go here.
});

describe("usingSignChange", () => {
  // More tests go here.
});