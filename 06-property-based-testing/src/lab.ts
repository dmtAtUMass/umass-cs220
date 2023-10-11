import assert from "assert";

const NUM_TESTS = 20; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size
function transpose(board: number[][]): number[][] {
  const res = [];
  for (let i = 0; i < board.length; i++) {
    const temp = [];
    for (let j = 0; j < board.length; j++) {
      temp.push(board[j][i]);
    }
    res.push(temp);
  }
  return res;
}

export function oracle(genArray: (num: number) => number[][]) {
  // TODO: Implement this function
  for (let i = 0; i < NUM_TESTS; i++) {
    const object = genArray(N);
    assert(object.length === N);
    assert(object.every(e => e.length === N));
    assert(object.every(e => Math.max(...e) < N && Math.min(...e) >= 0));
    assert(object.every(e => new Set(e).size === N));
    assert(transpose(object).every(e => new Set(e).size === N));
  }
}
