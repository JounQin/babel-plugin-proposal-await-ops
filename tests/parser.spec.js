import { parseExpression } from "../babel-parser";
import { Errors } from "../babel-parser/parser/error";

const COMMON_OPTIONS = {
  allowAwaitOutsideFunction: true,
  plugins: ["await-ops"],
};

describe("parser", () => {
  it("should just work", () => {
    expect(parseExpression("await.all foo", COMMON_OPTIONS))
      .toMatchInlineSnapshot(`
      Node {
        "argument": Node {
          "end": 13,
          "loc": SourceLocation {
            "end": Position {
              "column": 13,
              "line": 1,
            },
            "identifierName": "foo",
            "start": Position {
              "column": 10,
              "line": 1,
            },
          },
          "name": "foo",
          "start": 10,
          "type": "Identifier",
        },
        "comments": Array [],
        "end": 13,
        "errors": Array [],
        "loc": SourceLocation {
          "end": Position {
            "column": 13,
            "line": 1,
          },
          "start": Position {
            "column": 0,
            "line": 1,
          },
        },
        "operation": Node {
          "end": 9,
          "loc": SourceLocation {
            "end": Position {
              "column": 9,
              "line": 1,
            },
            "identifierName": "all",
            "start": Position {
              "column": 6,
              "line": 1,
            },
          },
          "name": "all",
          "start": 6,
          "type": "Identifier",
        },
        "start": 0,
        "type": "AwaitExpression",
      }
    `);
  });

  it("should be able to parse literal array", () => {
    expect(parseExpression("await.race []", COMMON_OPTIONS))
      .toMatchInlineSnapshot(`
      Node {
        "argument": Node {
          "elements": Array [],
          "end": 13,
          "loc": SourceLocation {
            "end": Position {
              "column": 13,
              "line": 1,
            },
            "start": Position {
              "column": 11,
              "line": 1,
            },
          },
          "start": 11,
          "type": "ArrayExpression",
        },
        "comments": Array [],
        "end": 13,
        "errors": Array [],
        "loc": SourceLocation {
          "end": Position {
            "column": 13,
            "line": 1,
          },
          "start": Position {
            "column": 0,
            "line": 1,
          },
        },
        "operation": Node {
          "end": 10,
          "loc": SourceLocation {
            "end": Position {
              "column": 10,
              "line": 1,
            },
            "identifierName": "race",
            "start": Position {
              "column": 6,
              "line": 1,
            },
          },
          "name": "race",
          "start": 6,
          "type": "Identifier",
        },
        "start": 0,
        "type": "AwaitExpression",
      }
    `);
  });

  it("should throw syntax error if plugin not enabled", () => {
    expect(() =>
      parseExpression("await.ops foo", {
        allowAwaitOutsideFunction: true,
      })
    ).toThrow("Unexpected token");
  });

  it("should throw on unsupported operation", () => {
    expect(() => parseExpression("await.ops foo", COMMON_OPTIONS)).toThrow(
      Errors.UnexpectedAwaitOperation.replace(/%0/g, "ops")
    );
  });

  it("should throw on invalid syntax", () => {
    expect(() => parseExpression("await. []", COMMON_OPTIONS)).toThrow(
      "Unexpected token"
    );
  });
});
