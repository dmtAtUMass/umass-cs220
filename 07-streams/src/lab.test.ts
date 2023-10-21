import assert from "assert";
import { Stream, sempty, snode, from, to } from "../include/stream.js";
import { every3_1, keepMult_1, interStream } from "./lab.js";

function compareStreams<T>(s1: Stream<T>, s2: Stream<T>, n: number): void {
  let r1 = s1; // Copy reference
  let r2 = s2;
  while (--n > 0) {
    assert(r1.isEmpty() === r2.isEmpty());
    if (!r1.isEmpty() && !r2.isEmpty()) {
      assert(r1.head() === r2.head());
      r1 = r1.tail();
      r2 = r2.tail();
    } else break;
  }
}

describe("every3", () => {
  it("returns a correct stream containing the multiples of 3", () => {
    const output = every3_1(0);
    const should_be = from(0, 3);
    compareStreams(output, should_be, 20);
  });
});

describe("keepMult", () => {
  it("first number is not included in result", () => {
    const input = snode(1, () => sempty());
    const output = keepMult_1(input);
    expect(output.isEmpty()).toBe(true);
  });

  it("works correctly for finite stream", () => {
    const input = snode(1, () => snode(4, () => snode(3, () => snode(6, () => sempty()))));
    const expected_output = snode(4, () => snode(6, () => sempty()));
    const output = keepMult_1(input);
    compareStreams(expected_output, output, 10);
  });

  it("works correctly for infinite stream", () => {
    function makeinput(n: number, prev: number): Stream<number> {
      if (n % 3 === 0) return snode(prev + 1, () => makeinput(n + 1, prev + 1));
      return snode(prev * 2, () => makeinput(prev * 2, n + 1));
    }
    const input = makeinput(0, 1);
    const expected_output = snode(4, () =>
      snode(4, () =>
        snode(10, () =>
          snode(22, () =>
            snode(46, () =>
              snode(94, () => snode(190, () => snode(382, () => snode(766, () => snode(1534, () => sempty())))))
            )
          )
        )
      )
    );
    const output = keepMult_1(input);
    compareStreams(expected_output, output, 9);
  });
});

describe("interStream", () => {
  it("two finite streams of equal length are interloven correctly", () => {
    const input_1 = to(0, 10, 2);
    const input_2 = to(1, 11, 2);
    const expected_output = to(0, 11, 1);
    const output = interStream(input_1, input_2);
    compareStreams(expected_output, output, 50);
  });

  it("two finite streams of different length are interloven correctly 1", () => {
    const input_1 = snode(0, () => sempty());
    const input_2 = to(1, 10, 1);
    const expected_output = to(0, 10, 1);
    const output = interStream(input_1, input_2);
    compareStreams(expected_output, output, 15);
  });

  it("two finite streams of different length are interloven correctly 2", () => {
    const input_1 = snode(0, () => to(2, 10, 1));
    const input_2 = snode(1, () => sempty());
    const expected_output = to(0, 10, 1);
    const output = interStream(input_1, input_2);
    compareStreams(expected_output, output, 15);
  });

  it("two infinite streams are interloven correctly", () => {
    const input_1 = from(0, -2);
    const input_2 = from(-1, -2);
    const expected_output = from(0, -1);
    const output = interStream(input_1, input_2);
    compareStreams(expected_output, output, 100);
  });
});
