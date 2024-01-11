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

// src/node/appData.ts
var appData_exports = {};
__export(appData_exports, {
  getAppData: () => getAppData
});
module.exports = __toCommonJS(appData_exports);
var import_path = __toESM(require("path"));

// src/node/constants.ts
var DEFAULT_OUTPUT_PATH = "dist";
var DEFAULT_ENTRY_PATH = "./emi.tsx";
var DEFAULT_TEMPORARY_PATH = "./.emi";
var DEFAULT_LAYOUT_PATH = "./src/layouts/index.tsx";

// package.json
var package_default = {
  name: "emi",
  version: "0.0.1",
  description: "",
  main: "./lib/node/cli.js",
  bin: "./bin/emi.js",
  files: [
    "./lib",
    "./bin"
  ],
  scripts: {
    "build:node": "npx esbuild ./src/node/** --platform=node --external:esbuild --bundle --outdir=lib/node",
    "build:client": "npx esbuild ./src/client/** --external:esbuild --bundle --outdir=lib/client",
    build: "pnpm build:node && pnpm build:client",
    dev: "pnpm build --watch"
  },
  keywords: [],
  author: "",
  license: "ISC",
  dependencies: {
    commander: "^11.1.0",
    esbuild: "^0.19.10",
    koa: "^2.14.2",
    "koa-better-http-proxy": "^0.2.10",
    "koa-static": "^5.0.0",
    portfinder: "^1.0.32"
  },
  devDependencies: {
    "@types/koa": "^2.13.12",
    "@types/koa-static": "~4.0.4",
    "@types/node": "^20.10.5"
  }
};

// src/node/appData.ts
function getAppData({ cwd }) {
  return new Promise((resolve, reject) => {
    const absSrcPath = import_path.default.join(cwd, "src");
    const absNodeModulesPath = import_path.default.join(cwd, "node_modules");
    const absOutputPath = import_path.default.join(cwd, DEFAULT_OUTPUT_PATH);
    const absLayoutPath = import_path.default.join(cwd, DEFAULT_LAYOUT_PATH);
    const absPagesPath = import_path.default.join(absSrcPath, "pages");
    const absTempPath = import_path.default.join(absNodeModulesPath, DEFAULT_TEMPORARY_PATH);
    const absEntryPath = import_path.default.join(absTempPath, DEFAULT_ENTRY_PATH);
    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTempPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath,
      absLayoutPath
    };
    resolve({ paths, pkg: package_default });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAppData
});
