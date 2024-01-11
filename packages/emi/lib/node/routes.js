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

// src/node/routes.ts
var routes_exports = {};
__export(routes_exports, {
  getRoutes: () => getRoutes
});
module.exports = __toCommonJS(routes_exports);
var import_path = __toESM(require("path"));
var import_fs = require("fs");
var import_promises = require("fs/promises");
async function getRoutes({
  appData
}) {
  return new Promise(async (resolve, reject) => {
    const files = await getFiles(appData.paths.absPagesPath);
    const routes = filesToRoutes(files, appData.paths.absPagesPath);
    const absLayoutPath = appData.paths.absLayoutPath;
    if ((0, import_fs.existsSync)(absLayoutPath)) {
      resolve([
        {
          path: "/",
          element: absLayoutPath.replace(import_path.default.extname(absLayoutPath), ""),
          routes
        }
      ]);
    } else {
      resolve(routes);
    }
  });
}
async function getFiles(root) {
  if (!(0, import_fs.existsSync)(root))
    return [];
  const files = await (0, import_promises.readdir)(root);
  const stats = await Promise.all(
    files.map((file) => {
      const absFilePath = import_path.default.join(root, file);
      return (0, import_promises.stat)(absFilePath);
    })
  );
  return files.filter((file, index) => {
    const isFile = stats[index].isFile();
    return isFile && /\.tsx?$/.test(file);
  });
}
function filesToRoutes(files, pagesPath) {
  return files.map((i) => {
    let pagePath = import_path.default.basename(i, import_path.default.extname(i));
    const element = import_path.default.resolve(pagesPath, pagePath);
    if (pagePath === "hello")
      pagePath = "";
    return {
      path: `/${pagePath}`,
      element
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRoutes
});
