// @flow
/* eslint sort-keys: "error" */
import { getLineInfo, type Position } from "../util/location";
import CommentsParser from "./comments";

// This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.

type ErrorContext = {
  pos: number,
  loc: Position,
  missingPlugin?: Array<string>,
  code?: string,
};

export { ErrorMessages as Errors } from "./error-message.js";

export default class ParserError extends CommentsParser {
  // Forward-declaration: defined in tokenizer/index.js
  /*::
  +isLookahead: boolean;
  */

  getLocationForPosition(pos: number): Position {
    let loc;
    if (pos === this.state.start) loc = this.state.startLoc;
    else if (pos === this.state.lastTokStart) loc = this.state.lastTokStartLoc;
    else if (pos === this.state.end) loc = this.state.endLoc;
    else if (pos === this.state.lastTokEnd) loc = this.state.lastTokEndLoc;
    else loc = getLineInfo(this.input, pos);

    return loc;
  }

  raise(pos: number, errorTemplate: string, ...params: any): Error | empty {
    return this.raiseWithData(pos, undefined, errorTemplate, ...params);
  }

  raiseWithData(
    pos: number,
    data?: {
      missingPlugin?: Array<string>,
      code?: string,
    },
    errorTemplate: string,
    ...params: any
  ): Error | empty {
    const loc = this.getLocationForPosition(pos);
    const message =
      errorTemplate.replace(/%(\d+)/g, (_, i: number) => params[i]) +
      ` (${loc.line}:${loc.column})`;
    return this._raise(Object.assign(({ loc, pos }: Object), data), message);
  }

  _raise(errorContext: ErrorContext, message: string): Error | empty {
    // $FlowIgnore
    const err: SyntaxError & ErrorContext = new SyntaxError(message);
    Object.assign(err, errorContext);
    if (this.options.errorRecovery) {
      if (!this.isLookahead) this.state.errors.push(err);
      return err;
    } else {
      throw err;
    }
  }
}
