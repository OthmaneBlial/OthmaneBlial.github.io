import { compileAst } from "./src/compiler.js?v=df8293ff189a";
import { parse } from "./src/parser.js?v=df8293ff189a";
import { regexToRules } from "./src/regex-to-rules.js?v=df8293ff189a";

/** Compile controlled-English rules into JavaScript regex source, flags and source mapping.
 * @param {string} source @param {{flags?: string}} [options]
 */
export function compile(source, options = {}) {
  return compileAst(parse(source), options);
}

/** Preserve the original function name for callers who only need the source.
 * @param {string} lines
 */
export function regexMatchingThroughLines(lines) {
  return compile(lines).source;
}

/** Create a native RegExp from a successful compile result.
 * @param {ReturnType<typeof compile>} result
 */
export function toRegExp(result) {
  if (!result || typeof result.source !== "string" || typeof result.flags !== "string") {
    throw new TypeError("Expected a compile result with source and flags.");
  }
  return new RegExp(result.source, result.flags);
}

export { CompileError } from "./src/diagnostics.js?v=df8293ff189a";
export { regexToRules };
