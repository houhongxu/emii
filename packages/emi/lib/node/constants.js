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

// src/node/constants.ts
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_DEV_HOST: () => DEFAULT_DEV_HOST,
  DEFAULT_DEV_PORT: () => DEFAULT_DEV_PORT,
  DEFAULT_ENTRY_PATH: () => DEFAULT_ENTRY_PATH,
  DEFAULT_ESBUILD_PORT: () => DEFAULT_ESBUILD_PORT,
  DEFAULT_LAYOUT_PATH: () => DEFAULT_LAYOUT_PATH,
  DEFAULT_OUTPUT_PATH: () => DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH: () => DEFAULT_TEMPORARY_PATH
});
module.exports = __toCommonJS(constants_exports);
var DEFAULT_OUTPUT_PATH = "dist";
var DEFAULT_ENTRY_PATH = "./src/index.tsx";
var DEFAULT_TEMPORARY_PATH = ".emi";
var DEFAULT_LAYOUT_PATH = "./src/layouts/index.tsx";
var DEFAULT_DEV_HOST = "127.0.0.1";
var DEFAULT_DEV_PORT = 2222;
var DEFAULT_ESBUILD_PORT = 3333;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_DEV_HOST,
  DEFAULT_DEV_PORT,
  DEFAULT_ENTRY_PATH,
  DEFAULT_ESBUILD_PORT,
  DEFAULT_LAYOUT_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH
});
