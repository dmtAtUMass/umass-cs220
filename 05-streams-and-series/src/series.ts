import { sempty, snode, Stream, from } from "../include/stream.js";

export type Series = Stream<number>;

export function addSeries(s: Series, t: Series): Series {
  if (s.isEmpty()) return t;
  else if (t.isEmpty()) return s;
  return snode(s.head() + t.head(), () => addSeries(s.tail(), t.tail()));
}

export function prodSeries(s: Series, t: Series): Series {
  if (s.isEmpty() || t.isEmpty()) return sempty();
  return addSeries(
    t.map(x => x * s.head()),
    snode(0, () => prodSeries(s.tail(), t))
  );
}

function prodOneOne(s: Series, t: Series): Series {
  if (s.isEmpty() || t.isEmpty()) return sempty();
  return snode(s.head() * t.head(), () => prodOneOne(s.tail(), t.tail()));
}

export function derivSeries(s: Series): Series {
  return prodOneOne(s, from(0)).tail();
}

function maskN(n: number): Stream<number> {
  return n < 0 ? sempty() : snode(1, () => maskN(n - 1));
}

export function coeff(s: Series, n: number): number[] {
  let firstN = prodOneOne(s, maskN(n));
  const arr = [];
  while (!firstN.isEmpty()) {
    arr.push(firstN.head());
    firstN = firstN.tail();
  }
  return arr;
}

export function evalSeries(s: Series, n: number): (x: number) => number {
  return x =>
    coeff(s, n).reduce(
      (acc: number[], i: number): number[] => {
        return [acc[0] + i * Math.pow(x, acc[1]), acc[1] + 1];
      },
      [0, 0]
    )[0];
}

export function applySeries(f: (c: number) => number, v: number): Series {
  return snode(v, () => applySeries(f, f(v)));
}

function invertFactorial(): (x: number) => number {
  let count = 0;
  return x => {
    count += 1;
    return x / count;
  };
}

export function expSeries(): Series {
  return applySeries(invertFactorial(), 1);
}

function dotProduct(s: number[], t: number[]): number {
  if (s.length === 0 || t.length === 0) return 0;
  return s[0] * t[0] + dotProduct(s.slice(1), t.slice(1));
}

function recurCount(len_init: number, init: number[], coef: number[]): () => Series {
  let k = 0;
  const stream = [init[0]];
  function something(): Series {
    k += 1;
    if (k < len_init) {
      stream.push(init[k]);
      return snode(init[k], () => something());
    } else {
      const res = snode(dotProduct(stream, coef), () => something());
      stream.push(dotProduct(stream, coef));
      stream.shift();
      return res;
    }
  }
  return something;
}

export function recurSeries(coef: number[], init: number[]): Series {
  return snode(init[0], () => recurCount(init.length, init, coef)());
}
