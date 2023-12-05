import { parseProgram, parseExpression } from "../include/parser.js";
import { printDecls, typeCheck } from "./lab.js";

describe("printDecls", () => {
  it("works with simple program with no nesting", () => {
    const logSpy = jest.spyOn(global.console, "log");

    const program = parseProgram(`
          let x = 1;
          let y = 2;
      `);

    printDecls(program, 0);
    expect(logSpy.mock.calls.sort()).toEqual([["0: x"], ["0: y"]].sort());

    logSpy.mockRestore();
  });

  it("works with simple program with one level of nesting", () => {
    const logSpy = jest.spyOn(global.console, "log");

    const program = parseProgram(`
          let x = 1;
          let y = 2;
          if (x === 1) {
              let z = 2;
              let x = 2;
          } else {}
      `);

    printDecls(program, 0);
    expect(logSpy.mock.calls.sort()).toEqual([["1: z"], ["1: x"], ["0: x"], ["0: y"]].sort());

    logSpy.mockRestore();
  });

  it("works with complex program that has multiple nesting levels", () => {
    const logSpy = jest.spyOn(global.console, "log");

    const program = parseProgram(`
          let x = 1;
          let y = 2;
          x2 = 5;
          print(x2);
  
          if (x > y) {
              let z = 3;
              if (x > z) {
              let x = 4;
              } else {
              let t = 5;
              }
          } else {
              let p = 6;
          }
  
          while (true) {
              let w = 7;
          }
      `);

    printDecls(program, 0);
    expect(logSpy.mock.calls.sort()).toEqual(
      [["2: x"], ["2: t"], ["1: z"], ["1: p"], ["1: w"], ["0: x"], ["0: y"]].sort()
    );

    logSpy.mockRestore();
  });

  it("multiple declarations in same scope prints error message", () => {
    const logSpy = jest.spyOn(global.console, "log");

    const program = parseProgram(`
          let x = 1;
          let x = 2;
      `);

    printDecls(program, 0);
    expect(logSpy.mock.calls.sort()).toEqual([["0: x"], ["duplicate declaration: x"]].sort());

    logSpy.mockRestore();
  });
});

describe("typeInterface", () => {
  it("works with only number", () => {
    const e = parseExpression("1");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("number");
    expect(env).toEqual({});
  });

  it("works with only boolean", () => {
    const e = parseExpression("false");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({});
  });

  it("works with only variable", () => {
    const e = parseExpression("x");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("any");
    expect(env).toEqual({
      x: "any",
    });
  });

  it("works with math operands and numbers", () => {
    const e = parseExpression("1 + 2 - 3 * 5 / 2");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("number");
    expect(env).toEqual({});
  });

  it("works with math operands and variables", () => {
    const e = parseExpression("a + b - c * d / e");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("number");
    expect(env).toEqual({
      a: "number",
      b: "number",
      c: "number",
      d: "number",
      e: "number",
    });
  });

  it("works with boolean operands and boolean values", () => {
    const e = parseExpression("true && false || true");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({});
  });

  it("works with boolean operands and variables", () => {
    const e = parseExpression("x && y || z");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({
      x: "boolean",
      y: "boolean",
      z: "boolean",
    });
  });

  it("works with comparison operands and numbers", () => {
    const e = parseExpression("1 < 2");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({});
  });

  it("works with comparison operands and variables", () => {
    const e = parseExpression("x > y");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({
      x: "number",
      y: "number",
    });
  });

  it("=== operator works with different operand types", () => {
    const e = parseExpression("true === 1");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({});
  });

  it("works with a complex expression that mixes everything without variables", () => {
    const e = parseExpression("(1 + 2) > 1 && true === 3 || (1 * 2 - 2 / 4) < 7");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({});
  });

  it("works with a complex expression that mixes everything with variables", () => {
    const e = parseExpression("(1 + x) > 1 && z === 3 || (1 * y - 2 / 4) < x && z");
    const env = {};
    const type = typeCheck(e, "any", env);
    expect(type).toBe("boolean");
    expect(env).toEqual({
      x: "number",
      y: "number",
      z: "boolean",
    });
  });

  it("throws error if one side of math operand is not a number", () => {
    const e = parseExpression("1 + true");
    const env = {};
    expect(() => typeCheck(e, "any", env)).toThrow(Error);
  });

  it("throws error when changes type does not match", () => {
    const e = parseExpression("1 + x && x");
    const env = {};
    expect(() => typeCheck(e, "any", env)).toThrow(Error);
  });

  it("throws error if logic operator recieves non boolean operand", () => {
    const e = parseExpression("1 || 2");
    const env = {};
    expect(() => typeCheck(e, "any", env)).toThrow(Error);
  });

  it("throws error if comparison operator recieves non number operand", () => {
    const e = parseExpression("true < false");
    const env = {};
    expect(() => typeCheck(e, "any", env)).toThrow(Error);
  });

  it("throws error if operator is unknown", () => {
    const e = parseExpression("true < false");
    if (e.kind === "operator") {
      e.operator = "😁";
    }
    const env = {};
    expect(() => typeCheck(e, "any", env)).toThrow(Error);
  });
});
