// Reduce Review

type Color = [number, number, number];

// Sample Reduce Implementation
function reduce<T, U>(a: T[], f: (acc: U, e: T) => U, init: U): U {
  let result = init;
  for (let i = 0; i < a.length; ++i) {
    result = f(result, a[i]);
  }
  return result;
}

// Example:

const arr = [3, 2, 6, 2, 2, 0];

const result = reduce(arr, (prod, e) => prod * e, 1);
// Alternatively: arr.reduce((prod, e) => prod * e, 1);

console.log(result);

// In class exercises
export function mainlyBlue(arr: Color[]): number {
  return arr.filter(e => e[2] >= 2 * e[0] && e[2] >= 2 * e[1]).length;
}

export function mainlyBlue2D(arr: Color[][]): number {
  // TODO: Implement this function
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    res += mainlyBlue(arr[i]);
  }
  return res;
}

export function sumLog(nums: number[]): number {
  return nums.filter(e => e >= 0).reduce((a, b) => a + Math.log(b));
}
