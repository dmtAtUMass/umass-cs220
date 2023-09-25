import { List, node, empty } from "../include/lists.js";

export function everyNList<T>(lst: List<T>, n: number): List<T> {
  // TODO: Implement this function
  return lst;
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  // TODO: Implement this function
  return lst;
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  // TODO: Implement this function
  return lst;
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return lst;
}

export function negativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return lst;
}

export function squashList(lst: List<number | List<number>>): List<number> {
  // TODO: Implement this function
  return node(1, node(2, empty()));
}

export function composeList<T>(lst: List<(n: T) => T>): (n: T) => T {
  // TODO: Implement this function
  return (n: T) => n;
}

export function composeFunctions<T, U>(funcArr: ((arg1: T, arg2: U) => T)[]): (a: U) => (x: T) => T {
  // TODO: Implement this function
  return (a: U) => (x: T) => x;
}
