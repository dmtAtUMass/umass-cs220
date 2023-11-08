import { getObjsWithName, composeFunctionsAsync } from "./lab.js";
import { setImplementation, resetImplementation } from "../include/fetch.js";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

beforeEach(() => resetImplementation());

describe("getObjsWithName", () => {
  it("works if all promises fulfill with an array of ObjsWithName", async () => {
    const objs = {
      a: [{ name: "test1a" }, { name: "test1b" }],
      b: [{ name: "test2a" }, { name: "test2b" }],
      c: [{ name: "test3a" }, { name: "test3b" }],
    };

    setImplementation(url => {
      const obj = JSON.stringify(objs[url as "a" | "b" | "c"]);
      return Promise.resolve(new Response(obj));
    });

    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);

    const should_include = {
      test1a: 1,
      test1b: 1,
      test2a: 1,
      test2b: 1,
      test3a: 1,
      test3b: 1,
    };

    type test = "test1a" | "test1b" | "test2a" | "test2b" | "test3a" | "test3b";

    res.forEach(o => {
      expect(--should_include[o.name as test]).toBe(0);
    });
  });

  it("returns empty array if all promises reject", async () => {
    setImplementation(() => {
      return Promise.reject();
    });

    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);

    expect(res).toHaveLength(0);
  });

  it("returns empty array if all promises fulfill but object have no name field", async () => {
    const objs = {
      a: [{}, {}],
      b: [{}, {}],
      c: [{}, {}],
    };

    setImplementation(url => {
      const obj = JSON.stringify(objs[url as "a" | "b" | "c"]);
      return Promise.resolve(new Response(obj));
    });

    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);

    expect(res).toHaveLength(0);
  });

  it("works with a mix of fulfilled and rejected promises and if fulfilled, name field is not always present", async () => {
    const objs = {
      a: [{ name: "test1a" }, { name: "test1b" }],
      b: [{ name: "test2a" }, {}],
      c: [{}, {}],
    };

    setImplementation(url => {
      if (url === "d") {
        return Promise.reject();
      }
      const obj = JSON.stringify(objs[url as "a" | "b" | "c"]);
      return Promise.resolve(new Response(obj));
    });

    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);

    const should_include = {
      test1a: 1,
      test1b: 1,
      test2a: 1,
    };

    type test = "test1a" | "test1b" | "test2a";

    res.forEach(o => {
      expect(--should_include[o.name as test]).toBe(0);
    });
  });
});

describe("composeFunctionsAsync", () => {
  it("composes async functions correctly", async () => {
    const myFunction = composeFunctionsAsync([
      fetch,
      (res: Response) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status} : ${res.statusText}`))),
    ]);

    const call1 = myFunction("https://220.maxkuechen.com/fetch?url=fakeURL");
    await expect(call1).rejects.toEqual(new Error("404 : Not Found"));

    const call2 = await myFunction(
      "https://220.maxkuechen.com/fetch?url=https://www.boredapi.com/api/activity?type=recreational"
    );
    console.log(call2);
    expect(call2).toHaveProperty("activity");
    expect(call2).toHaveProperty("type");
    expect(call2).toHaveProperty("participants");
    expect(call2).toHaveProperty("price");
    expect(call2).toHaveProperty("link");
    expect(call2).toHaveProperty("key");
    expect(call2).toHaveProperty("accessibility");
  });
});
