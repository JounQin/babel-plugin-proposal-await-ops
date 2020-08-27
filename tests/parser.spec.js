import { transform } from "@babel/core";

import babelPluginProposalAwaitOps from "../src";

describe("parser", () => {
  it("should just work", () => {
    expect(
      transform("const foo = 1", {
        plugins: [babelPluginProposalAwaitOps],
      }).code
    ).toBe("const foo = 1;");
  });
});
