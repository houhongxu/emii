"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/constants/index.ts
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_BUILD_PORT: () => DEFAULT_BUILD_PORT,
  DEFAULT_ENTRY_POINT: () => DEFAULT_ENTRY_POINT,
  DEFAULT_HOST: () => DEFAULT_HOST,
  DEFAULT_OUTDIR: () => DEFAULT_OUTDIR,
  DEFAULT_PORT: () => DEFAULT_PORT
});
module.exports = __toCommonJS(constants_exports);

// src/constants/html.ts
var DEFAULT_OUTDIR = "dist";
var DEFAULT_ENTRY_POINT = "src/index.tsx";
var DEFAULT_HOST = "127.0.0.1";
var DEFAULT_PORT = 2222;
var DEFAULT_BUILD_PORT = 3333;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_BUILD_PORT,
  DEFAULT_ENTRY_POINT,
  DEFAULT_HOST,
  DEFAULT_OUTDIR,
  DEFAULT_PORT
});
