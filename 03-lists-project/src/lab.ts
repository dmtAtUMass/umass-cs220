import { List, node } from "../include/lists.js";

// // Using lists examples

// // First, lets create the list 1 -> 2 -> 3 -> empty
// const threeList = node(1, node(2, node(3, empty())));

// // // Now, lets print these out.
// // console.log(threeList.head()); // Prints 1
// // console.log(threeList.tail().head()); // Prints 2
// // console.log(threeList.tail().tail().head()); // Prints 3
// // console.log(threeList.tail().tail().tail().head()); This fails because the empty node has no head.

// // Next lets write a function that will create a List of n nodes starting at n and decreasing to 1.
// function decrByOne(n: number): List<number> {
//   if (n === 0) {
//     return empty();
//   }
//   return node(n, decrByOne(n - 1));
// }

// const tenToOne = decrByOne(10);

// // Finally we'll write a function that converts a list to a string
// function listToString<T>(lst: List<T>): string {
//   if (lst.isEmpty()) {
//     // We always need to check if a list is empty when working recursively with lists
//     return "empty";
//   } else {
//     return `${JSON.stringify(lst.head())} -> ${JSON.stringify(listToString(lst.tail()))}`;
//   }
// }

// // console.log(listToString(tenToOne));

// // TS allows us destructure arrays:
// let a, b;
// [a, b] = [1, 2];

// // console.log(a);
// // console.log(b);

// // What does ... do?
// const c = [1, 2, 3];
// const d = [4, 5, 6];
// const e = [...c, ...d];

// // console.log(e);

// [a, b] = ["a", "b"];
// const [...rest] = ["c", "d", "e"];

// // console.log(a);
// // console.log(b);
// // console.log(rest);

// In Class Exercises
export function merge(l1: List<number>, l2: List<number>): List<number> {
  // TODO: complete this function
  if (l1.isEmpty()) return l2;
  if (l2.isEmpty()) return l1;
  if (l1.head() <= l2.head()) {
    return node(l1.head(), merge(l1.tail(), l2));
  } else {
    return node(l2.head(), merge(l2.tail(), l1));
  }
}

export function sumPositivesAndNegatives(arr: number[]): [number, number] {
  // TODO: complete this function
  return arr.reduce(
    (a, e) => {
      if (e >= 0) {
        a[0] += e;
      } else {
        a[1] += e;
      }
      return a;
    },
    [0, 0]
  );
}
