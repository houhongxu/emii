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

// src/node/config.ts
var config_exports = {};
__export(config_exports, {
  getUserConfig: () => getUserConfig
});
module.exports = __toCommonJS(config_exports);
var import_path = __toESM(require("path"));
var import_fs = require("fs");
async function getUserConfig({
  appData
}) {
  const buildedConfigPath = import_path.default.join(
    appData.paths.absEsbuildServePath,
    "config.js"
  );
  try {
    if ((0, import_fs.existsSync)(buildedConfigPath)) {
      const config = require(buildedConfigPath).default;
      delete require.cache[buildedConfigPath];
      return config;
    } else {
      return {};
    }
  } catch (e) {
    console.error("\u914D\u7F6E\u6587\u4EF6\u8BFB\u53D6\u9519\u8BEF", e);
    process.exit(1);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserConfig
});
