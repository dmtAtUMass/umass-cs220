import { Stream, snode, from } from "../include/stream.js";

// In Class Exercises

/**
 * EXCERCISE 1
 *
 * Create an infinite stream of non-negative integers that are multiples of 3. Do not use higher-order-functions.
 *
 */

export function every3_1(n: number): Stream<number> {
  // TODO: Implement this function
  return snode(n, () => from(n + 3, 3));
}

/**
 * EXCERCISE 2
 *
 * Write a function that takes as arguments a stream of numbers and returns a stream of those numbers which are
 * multiples of their predicessor in the original stream.
 *
 */

export function keepMult_1(s: Stream<number>): Stream<number> {
  // TODO: Implement this function
  let last = Infinity;
  return s.filter(e => {
    const ev = e % last === 0;
    last = e;
    return ev;
  });
}

/**
 * EXCERCISE 3
 *
 * Write a function that takes two streams (finite or infinite) and returns a single stream which interleaves
 * the values from each of the inputs.
 *
 */

export function interStream<T>(s1: Stream<T>, s2: Stream<T>): Stream<T> {
  if (s1.isEmpty()) {
    return s2;
  } else {
    return snode(s1.head(), () => interStream(s2, s1.tail()));
  }
}
