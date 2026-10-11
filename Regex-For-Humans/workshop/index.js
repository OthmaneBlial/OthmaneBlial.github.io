import { compileAst } from "./src/compiler.js?v=049b4eaff903";
import { parse } from "./src/parser.js?v=049b4eaff903";
import { regexToRules } from "./src/regex-to-rules.js?v=049b4eaff903";

/** Compile controlled-English rules into JavaScript regex source, flags and source mapping.
 * @param {string} source @param {{flags?: string | undefined}} [options]
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

/** Create a native RegExp from a compile result or its source/flags metadata.
 * @param {ReturnType<typeof compile> | Pick<ReturnType<typeof compile>, "source" | "flags">} result
 */
export function toRegExp(result) {
  const source = result ? result.source : undefined;
  const flags = typeof source === "string" ? result.flags : undefined;
  if (typeof source !== "string" || typeof flags !== "string") {
    throw new TypeError("Expected a compile result with source and flags.");
  }
  return new RegExp(source, flags);
}

export { analyze } from "./src/analyze.js?v=049b4eaff903";
export { CompileError } from "./src/diagnostics.js?v=049b4eaff903";
export { toSVG } from "./src/diagram.js?v=049b4eaff903";
export { editGroup } from "./src/edit-group.js?v=049b4eaff903";
export { exportRegex } from "./src/export.js?v=049b4eaff903";
export { regexToRules };
