"use strict";var U=Object.create;var m=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty;var I=(t,e)=>{for(var o in e)m(t,o,{get:e[o],enumerable:!0})},E=(t,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of D(e))!P.call(t,r)&&r!==o&&m(t,r,{get:()=>e[r],enumerable:!(s=d(e,r))||s.enumerable});return t};var F=(t,e,o)=>(o=t!=null?U(L(t)):{},E(e||!t||!t.__esModule?m(o,"default",{value:t,enumerable:!0}):o,t)),O=t=>E(m({},"__esModule",{value:!0}),t);var $={};I($,{generateHtml:()=>S,generateIndex:()=>g});module.exports=O($);var T=require("fs"),p=require("fs/promises");var l="127.0.0.1";var _=F(require("path")),u=0;async function g({appData:t,routes:e,userConfig:o}){let s=n=>{let i="",c="";return n.forEach(a=>{if(u++,c+=`import Module${u} from '${a.element}';
`,i+=`<Route path='${a.path}' element={<Module${u}/>}>;
`,a.routes){let{routeStr:x,importStr:R}=s(a.routes);i+=x,c+=R}i+=`</Route>
`}),{routeStr:i,importStr:c}},{routeStr:r,importStr:f}=s(e),A=`
  import { createRoot } from 'react-dom/client'
  import { BrowserRouter, Route, Routes } from 'react-router-dom'
  import { createElement } from 'react'
  import { KeepAliveLayout } from 'react-router-keep-alive'
  ${f}

  const App = () => {
    return (
      <KeepAliveLayout keepalivePaths={[${o.keepalive?.map(n=>typeof n=="string"?`'${n}'`:n)||[]}]}>
        <BrowserRouter>
          <Routes>
            ${r}
          </Routes>
        </BrowserRouter>
      </KeepAliveLayout>
    )
  }
  
  const root = createRoot(document.getElementById('root')!)
  
  root.render(createElement(App))
  `;try{(0,T.existsSync)(t.paths.absTempPath)||await(0,p.mkdir)(t.paths.absTempPath),await(0,p.writeFile)(t.paths.absEntryPath,A,"utf-8")}catch(n){console.error("\u751F\u6210index\u5931\u8D25",n)}}async function S({appData:t,userConfig:e,isProduction:o=!1}){let s=`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>${e.title||t.pkg.name||"Emi"}</title>
        <link rel="stylesheet" href="${o?".":`http://${l}:${2222}`}/index.css"></link>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
        </div>

        <script src="${o?".":`http://${l}:${2222}`}/index.js"></script>
        ${o?"":'<script src="/hot-reloading.js"></script>'}
    </body>
    </html>
    `;try{(0,T.existsSync)(t.paths.absTempPath)||await(0,p.mkdir)(t.paths.absTempPath),await(0,p.writeFile)(o?_.default.join(t.paths.absOutputPath,"index.html"):t.paths.absHtmlPath,s,"utf-8")}catch(r){console.error("\u751F\u6210html\u5931\u8D25",r)}return s}0&&(module.exports={generateHtml,generateIndex});
