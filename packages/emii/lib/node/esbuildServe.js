"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node/esbuildServe.ts
var esbuildServe_exports = {};
__export(esbuildServe_exports, {
  esbuildServe: () => esbuildServe
});
module.exports = __toCommonJS(esbuildServe_exports);
var import_esbuild = require("esbuild");

// src/node/constants/hosts.ts
var DEFAULT_DEV_HOST = "127.0.0.1";

// src/node/esbuildServe.ts
var import_path = __toESM(require("path"));
async function esbuildServe({
  platform,
  outfileName,
  entry,
  port,
  appData,
  plugins
}) {
  const ctx = await (0, import_esbuild.context)({
    platform,
    outfile: import_path.default.join(appData.paths.absEsbuildServePath, outfileName),
    bundle: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify("development")
    },
    entryPoints: [entry],
    tsconfig: import_path.default.join(appData.paths.cwd, "tsconfig.json"),
    plugins
  });
  await ctx.watch();
  const serveRes = await ctx.serve({
    servedir: appData.paths.absEsbuildServePath,
    host: DEFAULT_DEV_HOST,
    port,
    onRequest: (args) => {
      console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`);
    }
  });
  process.on("SIGINT", () => {
    ctx.dispose();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    ctx.dispose();
    process.exit(0);
  });
  return serveRes;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esbuildServe
});
