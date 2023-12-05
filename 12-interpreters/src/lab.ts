import { Statement, BinaryOperator, Expression } from "../include/parser.js";

/**
 * Exercise 1
 * Scoping
 */
export function printDecls(program: Statement[], level: number) {
  function doDecl(s: Statement, scope: { [key: string]: any }) {
    switch (s.kind) {
      case "let":
        if (s.name in scope) {
          console.log("duplicate declaration: " + s.name);
        } else {
          Object.defineProperty(scope, s.name, {});
        }
        return;
      case "if":
        printDecls(s.truePart, level + 1);
        printDecls(s.falsePart, level + 1);
        return;
      case "while":
        printDecls(s.body, level + 1);
        return;
      default:
        return;
    }
  }

  const scope = {};
  program.forEach(s => doDecl(s, scope));
  const names = Object.getOwnPropertyNames(scope);
  names.forEach(name => {
    console.log(level.toString() + ": " + name);
  });
  // TODO: Use the doDecl helper by iterating through the program
}

/**
 * Exercise 2
 * Type Inference
 */
type Type = string;
interface TypeMap {
  [key: string]: Type;
}
interface BinExp {
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}
const boolOp = (s: string) => s === "&&" || s === "||";
const cmpOp = (s: string) => s === "<" || s === ">";
const mathOp = (s: string) => s === "+" || s === "-" || s === "*" || s === "/";

const checkEq = (v: any, oldT: Type, newT: Type) => {
  if (newT !== "any" && oldT !== newT) {
    throw new Error(`type mismatch for ${v}: is ${oldT}, should be ${newT}`);
  }
};

export function typeCheck(e: Expression, expected: Type, env: TypeMap): Type {
  function checkBoth(e: BinExp, operandType: Type, resultType: Type) {
    typeCheck(e.left, operandType, env);
    typeCheck(e.right, operandType, env);
    checkEq(e.operator, resultType, expected);
    return resultType;
  }

  switch (e.kind) {
    case "boolean":
      checkEq(e.value, "boolean", expected);
      return "boolean";
    case "number":
      checkEq(e.value, "number", expected);
      return "number";
    case "variable":
      if (!(e.name in env) || env[e.name] === `any`) {
        env[e.name] = expected;
      }
      checkEq(e.name, env[e.name], expected);
      return env[e.name];
    case "operator":
      if (boolOp(e.operator)) {
        return checkBoth(e, "boolean", "boolean");
      } else if (cmpOp(e.operator)) {
        return checkBoth(e, "number", "boolean");
      } else if (mathOp(e.operator)) {
        return checkBoth(e, "number", "number");
      } else if (e.operator === "===") {
        return checkBoth(e, "any", "boolean");
      } else {
        throw new Error(`unknown operator ${e.operator}`);
      }
    default:
      return expected;
  }
}
