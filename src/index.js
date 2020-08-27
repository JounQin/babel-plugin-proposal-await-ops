import { parse } from "../babel-parser";

export default function babelPluginProposalAwaitOps(api, options) {
  api.assertVersion(7);
  return {
    parserOverride(code, options) {
      return parse(code, options);
    },
  };
}
