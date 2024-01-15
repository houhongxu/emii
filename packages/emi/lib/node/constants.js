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

// src/node/constants/index.ts
var constants_exports = {};
__export(constants_exports, {
  CONFIG_REBUILD_EVENT: () => CONFIG_REBUILD_EVENT,
  DEFAULT_CONFIG_PATH: () => DEFAULT_CONFIG_PATH,
  DEFAULT_DEV_HOST: () => DEFAULT_DEV_HOST,
  DEFAULT_DEV_PORT: () => DEFAULT_DEV_PORT,
  DEFAULT_ENTRY_PATH: () => DEFAULT_ENTRY_PATH,
  DEFAULT_ESBUILD_CONFIG_PORT: () => DEFAULT_ESBUILD_CONFIG_PORT,
  DEFAULT_ESBUILD_INDEX_PORT: () => DEFAULT_ESBUILD_INDEX_PORT,
  DEFAULT_ESBUILD_SERVE_PATH: () => DEFAULT_ESBUILD_SERVE_PATH,
  DEFAULT_LAYOUT_PATH: () => DEFAULT_LAYOUT_PATH,
  DEFAULT_MOCK_PATH: () => DEFAULT_MOCK_PATH,
  DEFAULT_MOCK_PORT: () => DEFAULT_MOCK_PORT,
  DEFAULT_OUTPUT_PATH: () => DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH: () => DEFAULT_TEMPORARY_PATH
});
module.exports = __toCommonJS(constants_exports);

// src/node/constants/paths.ts
var DEFAULT_OUTPUT_PATH = "dist";
var DEFAULT_ENTRY_PATH = "./emi.tsx";
var DEFAULT_TEMPORARY_PATH = ".emi";
var DEFAULT_LAYOUT_PATH = "./src/layouts/index.tsx";
var DEFAULT_CONFIG_PATH = "./emi.config.ts";
var DEFAULT_ESBUILD_SERVE_PATH = ".esbuild";
var DEFAULT_MOCK_PATH = "mock";

// src/node/constants/ports.ts
var DEFAULT_DEV_PORT = 2222;
var DEFAULT_ESBUILD_INDEX_PORT = 2223;
var DEFAULT_ESBUILD_CONFIG_PORT = 2224;
var DEFAULT_MOCK_PORT = 2225;

// src/node/constants/hosts.ts
var DEFAULT_DEV_HOST = "127.0.0.1";

// src/node/constants/events.ts
var CONFIG_REBUILD_EVENT = "config_rebuild";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CONFIG_REBUILD_EVENT,
  DEFAULT_CONFIG_PATH,
  DEFAULT_DEV_HOST,
  DEFAULT_DEV_PORT,
  DEFAULT_ENTRY_PATH,
  DEFAULT_ESBUILD_CONFIG_PORT,
  DEFAULT_ESBUILD_INDEX_PORT,
  DEFAULT_ESBUILD_SERVE_PATH,
  DEFAULT_LAYOUT_PATH,
  DEFAULT_MOCK_PATH,
  DEFAULT_MOCK_PORT,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH
});
