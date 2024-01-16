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

// src/node/generate.ts
var generate_exports = {};
__export(generate_exports, {
  generateHtml: () => generateHtml,
  generateIndex: () => generateIndex
});
module.exports = __toCommonJS(generate_exports);
var import_fs = require("fs");
var import_promises = require("fs/promises");

// src/node/constants/ports.ts
var DEFAULT_DEV_PORT = 2222;

// src/node/constants/hosts.ts
var DEFAULT_DEV_HOST = "127.0.0.1";

// src/node/generate.ts
var import_path = __toESM(require("path"));
var count = 0;
async function generateIndex({
  appData,
  routes,
  userConfig
}) {
  const getRouteStr = (routes2) => {
    let routeStr2 = "";
    let importStr2 = "";
    routes2.forEach((route) => {
      count++;
      importStr2 += `import Module${count} from '${route.element}';
`;
      routeStr2 += `<Route path='${route.path}' element={<Module${count}/>}>;
`;
      if (route.routes) {
        const { routeStr: subRouteStr, importStr: subImportStr } = getRouteStr(
          route.routes
        );
        routeStr2 += subRouteStr;
        importStr2 += subImportStr;
      }
      routeStr2 += "</Route>\n";
    });
    return { routeStr: routeStr2, importStr: importStr2 };
  };
  const { routeStr, importStr } = getRouteStr(routes);
  const content = `
  import { createRoot } from 'react-dom/client'
  import { BrowserRouter, Route, Routes } from 'react-router-dom'
  import { createElement } from 'react'
  import { KeepAliveLayout } from 'react-router-keep-alive'
  ${importStr}

  const App = () => {
    return (
      <KeepAliveLayout keepalivePaths={[${// 模板字符串会吞掉数组和字符串，所以在外面套[]，在字符串值外面套''
  userConfig.keepalive?.map(
    (i) => typeof i === "string" ? `'${i}'` : i
  ) || []}]}>
        <BrowserRouter>
          <Routes>
            ${routeStr}
          </Routes>
        </BrowserRouter>
      </KeepAliveLayout>
    )
  }
  
  const root = createRoot(document.getElementById('root')!)
  
  root.render(createElement(App))
  `;
  try {
    if (!(0, import_fs.existsSync)(appData.paths.absTempPath)) {
      await (0, import_promises.mkdir)(appData.paths.absTempPath);
    }
    await (0, import_promises.writeFile)(appData.paths.absEntryPath, content, "utf-8");
  } catch (e) {
    console.error("\u751F\u6210index\u5931\u8D25", e);
  }
}
async function generateHtml({
  appData,
  userConfig,
  isProduction = false
}) {
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>${userConfig.title || appData.pkg.name || "Emi"}</title>
        <link rel="stylesheet" href="${isProduction ? "." : `http://${DEFAULT_DEV_HOST}:${DEFAULT_DEV_PORT}`}/index.css"></link>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
        </div>

        <script src="${isProduction ? "." : `http://${DEFAULT_DEV_HOST}:${DEFAULT_DEV_PORT}`}/index.js"></script>
        ${isProduction ? "" : '<script src="/hot-reloading.js"></script>'}
    </body>
    </html>
    `;
  try {
    if (!(0, import_fs.existsSync)(appData.paths.absTempPath)) {
      await (0, import_promises.mkdir)(appData.paths.absTempPath);
    }
    await (0, import_promises.writeFile)(
      isProduction ? import_path.default.join(appData.paths.absOutputPath, "index.html") : appData.paths.absHtmlPath,
      content,
      "utf-8"
    );
  } catch (e) {
    console.error("\u751F\u6210html\u5931\u8D25", e);
  }
  return content;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateHtml,
  generateIndex
});
