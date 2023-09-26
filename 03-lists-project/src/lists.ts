import { List, node, empty, reverseList } from "../include/lists.js";

export function everyNList<T>(lst: List<T>, n: number): List<T> {
  // TODO: Implement this function
  return reverseList(everyNRev(lst, n));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  // TO DO: Implement this function
  return lst.reduce(
    (acc: [List<T>, number], e: T): [List<T>, number] => {
      return acc[1] % n === 0 ? [node(e, acc[0]), acc[1] + 1] : [acc[0], acc[1] + 1];
    },
    [empty<T>(), 1]
  )[0];
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  return everyNList(
    lst.filter(e => cond(e)),
    n
  );
}

function conditionalProducts(lst: List<number>, cond: (e: number) => boolean): List<number> {
  return reverseList(
    lst.reduce(
      (acc: [List<number>, number], e: number): [List<number>, number] => {
        return cond(e) ? [node(e * acc[1], acc[0]), e * acc[1]] : [acc[0], 1];
      },
      [empty<number>(), 1]
    )[0]
  );
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return conditionalProducts(lst, (e: number) => e >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return conditionalProducts(lst, (e: number) => e < 0);
}

export function squashList(lst: List<number | List<number>>): List<number> {
  // TODO: Implement this function
  return reverseList(
    lst.reduce((acc: List<number>, e: number | List<number>): List<number> => {
      return typeof e === "number"
        ? node(e, acc)
        : node(
            e.reduce((acc, e) => acc + e, 0),
            acc
          );
    }, empty<number>())
  );
}

export function composeList<T>(lst: List<(n: T) => T>): (n: T) => T {
  return lst.reduce(
    (acc, e) => {
      return x => e(acc(x));
    },
    e => e
  );
}

export function composeFunctions<T, U>(funcArr: ((arg1: T, arg2: U) => T)[]): (a: U) => (x: T) => T {
  // TODO: Implement this function
  return (x: U) => {
    return funcArr.reduce(
      (acc: (m: T) => T, e) => {
        return (y: T) => e(acc(y), x);
      },
      (x: T) => x
    );
  };
}
