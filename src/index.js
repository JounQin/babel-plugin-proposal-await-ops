import { declare } from "@babel/helper-plugin-utils";

import { parse } from "../babel-parser";

import syntax from "./syntax";

export default declare((api) => {
  api.assertVersion(7);

  const t = api.types;

  return {
    name: "transform-await-ops",
    inherits: syntax,
    parserOverride: parse,
    visitor: {
      AwaitExpression({ node }) {
        if (!node.operation) {
          return;
        }

        node.argument = t.callExpression(
          t.memberExpression(
            t.identifier("Promise"),
            node.operation
          ),
          [node.argument]
        );

        delete node.operation;
      },
    },
  };
});
