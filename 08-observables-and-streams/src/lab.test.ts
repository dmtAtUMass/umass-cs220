import { Economy, Stock, Newscast, maxUpTo } from "./lab.js";
import { snode, sempty, Stream } from "../include/stream.js";

describe("Economy", () => {
  it("Calling updateRate notifies all subscribers", () => {
    const arr: number[] = [];
    const spy1 = jest.fn(n => arr.push(n));
    const spy2 = jest.fn(n => expect(n).toBe(10));
    const economy = new Economy();
    economy.subscribe(spy1);
    economy.updateRate(15);
    economy.subscribe(spy2);
    economy.updateRate(10);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(arr).toEqual([15, 10]);
  });

  it("Multiple economies do not collide", () => {
    const NYSEspy = jest.fn(n => expect(n).toBe(5));
    const NASDAQspy = jest.fn(n => expect(n).toBe(10));
    const NYSE = new Economy();
    const NASDAQ = new Economy();
    NYSE.subscribe(NYSEspy);
    NASDAQ.subscribe(NASDAQspy);
    NYSE.updateRate(5);
    NASDAQ.updateRate(10);
    NYSE.updateRate(5);
    NASDAQ.updateRate(10);
    NYSE.updateRate(5);
    expect(NYSEspy).toHaveBeenCalledTimes(3);
    expect(NASDAQspy).toHaveBeenCalledTimes(2);
  });
});

describe("Stock", () => {
  it("Calling updatePrice notifies all subscribers", () => {
    const arr: number[] = [];
    const spy1 = jest.fn(n => arr.push(n));
    const spy2 = jest.fn(n => expect(n).toBe(35));
    const stock = new Stock("UMASS", 5, 10);
    stock.subscribe(spy1);
    stock.updatePrice(1);
    stock.subscribe(spy2);
    stock.updatePrice(7);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(arr).toEqual([5, 35]);
  });

  it("Multiple stocks do not collide", () => {
    const MSFTspy = jest.fn(n => expect(n).toBe(25));
    const APPLspy = jest.fn(n => expect(n).toBe(70));
    const MSFT = new Stock("MSFT", 5, 1);
    const APPL = new Stock("APPL", 7, 2);
    MSFT.subscribe(MSFTspy);
    APPL.subscribe(APPLspy);
    MSFT.updatePrice(5);
    APPL.updatePrice(10);
    MSFT.updatePrice(5);
    APPL.updatePrice(10);
    MSFT.updatePrice(5);
    expect(MSFTspy).toHaveBeenCalledTimes(3);
    expect(APPLspy).toHaveBeenCalledTimes(2);
  });
});

describe("Newscast", () => {
  it("Newscast works when combined with Stock and Economy", () => {
    const arr: [string, number][] = [];
    const spy = jest.fn(n => arr.push(n));
    const economy = new Economy();
    const news = new Newscast();
    const MSFT = new Stock("MSFT", 5, 1);
    const APPL = new Stock("APPL", 7, 2);
    news.subscribe(spy);
    economy.subscribe(rate => MSFT.updatePrice(rate));
    economy.subscribe(rate => APPL.updatePrice(rate));
    news.observe(MSFT, APPL);
    economy.updateRate(5);
    economy.updateRate(7);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(arr).toEqual([
      ["MSFT", 25],
      ["APPL", 35],
      ["MSFT", 35],
      ["APPL", 49],
    ]);
  });
});

describe("maxUpTo", () => {
  it("Increasing stream remains the same", () => {
    const stream = snode(1, () => snode(3, () => snode(5, () => sempty())));
    const result = maxUpTo(stream);
    expect(result).not.toBe(stream);
    expect(result.head()).toBe(1);
    expect(result.tail().head()).toBe(3);
    expect(result.tail().tail().head()).toBe(5);
    expect(result.tail().tail().tail().isEmpty()).toBeTruthy();
  });

  it("Decreasing stream is the first number", () => {
    const stream = snode(5, () => snode(3, () => snode(1, () => sempty())));
    const result = maxUpTo(stream);
    expect(result).not.toBe(stream);
    expect(result.head()).toBe(5);
    expect(result.tail().head()).toBe(5);
    expect(result.tail().tail().head()).toBe(5);
    expect(result.tail().tail().tail().isEmpty()).toBeTruthy();
  });

  it("Random stream is correct", () => {
    const stream = snode(1, () => snode(0, () => snode(5, () => sempty())));
    const result = maxUpTo(stream);
    expect(result).not.toBe(stream);
    expect(result.head()).toBe(1);
    expect(result.tail().head()).toBe(1);
    expect(result.tail().tail().head()).toBe(5);
    expect(result.tail().tail().tail().isEmpty()).toBeTruthy();
  });
});
