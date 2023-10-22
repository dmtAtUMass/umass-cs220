import { Stream, to } from "../include/stream.js";
import {
  addSeries,
  derivSeries,
  prodSeries,
  coeff,
  evalSeries,
  recurSeries,
  applySeries,
  expSeries,
} from "./series.js";

function expectStreamToBe<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);

    s = s.tail();
  }

  expect(s.isEmpty()).toBe(true);
}

function expectStreamToBeginWith<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);
    s = s.tail();
  }
}

describe("addSeries", () => {
  it("adds simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 5);
    const c = addSeries(a, b);

    expectStreamToBe(c, [2, 4, 6, 8, 10]);
  });
});

describe("prodSeries", () => {
  it("multiply simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 3);
    const b = to(1, 2);
    const c = prodSeries(a, b);
    expectStreamToBe(c, [1, 4, 7, 6]);
  });
});

describe("derivSeries", () => {
  it("derivative of simple finite stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const c = derivSeries(a);

    expectStreamToBe(c, [2, 6, 12, 20]);
  });
});

describe("coeff", () => {
  it("get the first few terms of a simple stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    for (let i = 0; i < 5; i++) {
      const c = coeff(a, i);
      expect(c).toEqual(Array.from({ length: i + 1 }, (_, i) => i + 1));
    }
  });
});

describe("evalSeries", () => {
  it("evaluate first few terms of simple stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const c = evalSeries(a, 3);
    expect(c(1)).toEqual(10);
    expect(c(2)).toEqual(49);
  });
});

describe("applySeries", () => {
  it("evaluate first few terms of simple stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = 3;
    const c = applySeries(x => x + 1, a);
    expectStreamToBeginWith(c, [3, 4, 5, 6, 7]);
  });
});

describe("expSeries", () => {
  it("evaluate first few terms of taylor's series", () => {
    expectStreamToBeginWith(expSeries(), [1, 1, 0.5, 0.16666666666666666, 0.041666666666666664]);
  })

});

describe("recurSeries", () => {
  // More tests for recurSeries go here
  it("should correctly apply recurSeries", () => {
    const coef = [1, 3, 5, 7, 9];
    const init = [2, 4, 6, 8, 10];
    let res = recurSeries(coef, init);

    const tmp: number[] = [];
    for (let i = 0; i < coef.length * 3; i++) {
      if (i < coef.length) {
        tmp.push(init[i]);
      } else {
        let res = 0;
        for (let j = 0; j < coef.length; j++) {
          res += coef[j] * tmp[i - coef.length + j];
        }
        tmp.push(res);
      }
      expect(tmp[i]).toEqual(res.head());
      res = res.tail();
    }
  });
});
