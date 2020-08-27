import { transform } from "@babel/core";

import babelPluginProposalAwaitOps from "../src";

const COMMON_OPTIONS = {
  babelrc: false,
  plugins: ["@babel/syntax-top-level-await", babelPluginProposalAwaitOps],
};

describe("plugin", () => {
  it("should just work", () => {
    expect(transform(`await.all foo`, COMMON_OPTIONS).code).toBe(
      "await Promise.all(foo);"
    );
  });

  it("should work with literal array", () => {
    expect(transform(`await.all [Promise.resolve()]`, COMMON_OPTIONS).code).toBe(
      "await Promise.all([Promise.resolve()]);"
    );
  });

  it("should work with regular await expression", () => {
    expect(transform(`await foo`, COMMON_OPTIONS).code).toBe("await foo;");
  });
});
