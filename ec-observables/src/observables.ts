// import { escape } from "querystring";
import { Observable, Observer } from "../include/observable.js";

// Extra Credit Functions

export function classifyObservables(obsArr: (Observable<string> | Observable<number> | Observable<boolean>)[]): {
  string: Observable<string>;
  number: Observable<number>;
  boolean: Observable<boolean>;
} {
  // TODO: Implement this function
  const string = new Observable<string>();
  const number = new Observable<number>();
  const boolean = new Observable<boolean>();

  obsArr.forEach(obs => {
    obs.subscribe(val => {
      if (typeof val === "string") {
        string.update(val);
      } else if (typeof val === "number") {
        number.update(val);
      } else {
        boolean.update(val);
      }
    });
  });

  return { string, number, boolean };
}

export function obsStrCond(
  funcArr: ((arg1: string) => string)[],
  f: (arg1: string) => boolean,
  o: Observable<string>
): Observable<string> {
  const result = new Observable<string>();
  const compositeFunc = funcArr.reduce(
    (acc, f1) => x => f1(acc(x)),
    x => x
  );
  o.subscribe(data => {
    if (f(compositeFunc(data))) result.update(compositeFunc(data));
    else result.update(data);
  });
  return result;
}

export function statefulObserver(o: Observable<number>): Observable<number> {
  // TODO: Implement this function
  const result = new Observable<number>();
  let prev = Infinity;
  o.subscribe(data => {
    if (prev !== 0 && data % prev === 0) result.update(data);
    prev = data;
  });
  return result;
}

// Optional Additional Practice

export function mergeMax(o1: Observable<number>, o2: Observable<number>): Observable<{ obs: number; v: number }> {
  const result = new Observable<{ obs: number; v: number }>();
  let max = -Infinity;
  o1.subscribe(data => {
    if (data >= max) result.update({ obs: 1, v: data });
    max = Math.max(max, data);
  });
  o2.subscribe(data => {
    if (data >= max) result.update({ obs: 2, v: data });
    max = Math.max(max, data);
  });
  return result;
}

export function merge(o1: Observable<string>, o2: Observable<string>): Observable<string> {
  const result = new Observable<string>();
  o1.subscribe(data => result.update(data));
  o2.subscribe(data => result.update(data));
  return result;
}

export class GreaterAvgObservable extends Observable<number> {
  constructor() {
    super();
  }

  greaterAvg(): Observable<number> {
    const result = new Observable<number>();
    let prev1 = -Infinity;
    let prev2 = -Infinity;
    this.subscribe(data => {
      const conditions = [
        prev2 === -Infinity,
        prev1 === -Infinity && data >= 1.5 * prev1,
        data >= (1.5 * (prev1 + prev2)) / 2,
      ];
      if (conditions.some(e => e)) result.update(data);
      prev1 = prev2;
      prev2 = data;
    });
    return result;
  }
}

export class SignChangeObservable extends Observable<number> {
  constructor() {
    super();
  }

  signChange(): Observable<number> {
    // TODO: Implement this method
    let prev = 0;
    const result = new Observable<number>();
    this.subscribe(data => {
      if (data !== 0 && data * prev <= 0) result.update(data);
      prev = data;
    });
    return result;
  }
}

/**
 * This function shows how the class you created above could be used.
 * @param numArr Array of numbers
 * @param f Observer function
 */
export function usingSignChange(numArr: number[], f: Observer<number>) {
  const o = new SignChangeObservable();
  const o1 = o.signChange();
  o1.subscribe(data => f(data));
  numArr.forEach(e => o1.update(e));
}
