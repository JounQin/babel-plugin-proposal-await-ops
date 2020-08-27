import { parse } from "../babel-parser";
import generate from "../babel-generator";

describe("generator", () => {
  it("should just work", () => {
    const code = "await.all foo";
    const ast = parse(code, {
      allowAwaitOutsideFunction: true,
      plugins: ["await-ops"],
    });
    expect(generate(ast, undefined, code).code).toBe("await.all foo;");
  });
});
