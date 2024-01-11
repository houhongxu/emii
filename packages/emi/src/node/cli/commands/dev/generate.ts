import { existsSync } from 'fs'
import { IAppData, IRoute } from '../../../types'
import { mkdir, writeFile } from 'fs/promises'
import { DEFAULT_DEV_HOST } from '../../../constants'
import path from 'path'

let count = 0

/**
 * 生成入口index
 */
export async function generateIndex({
  appData,
  routes,
}: {
  appData: IAppData
  routes: IRoute[]
}) {
  /**
   * 获取导入与路由字符串
   */
  const getRouteStr = (routes: IRoute[]) => {
    let routeStr = ''
    let importStr = ''

    routes.forEach((route) => {
      count++

      importStr += `import Module${count} from '${route.element}';\n`
      routeStr += `<Route path='${route.path}' element={<Module${count}/>}>;\n`

      if (route.routes) {
        const { routeStr: subRouteStr, importStr: subImportStr } = getRouteStr(
          route.routes,
        )

        routeStr += subRouteStr
        importStr += subImportStr
      }

      routeStr += '</Route>\n'
    })

    return { routeStr, importStr }
  }

  const { routeStr, importStr } = getRouteStr(routes)

  const content = `
  import { createRoot } from 'react-dom/client'
  import { BrowserRouter, Route, Routes } from 'react-router-dom'
  import { createElement } from 'react'
  import { KeepAliveLayout } from 'react-router-keep-alive'
  ${importStr}

  const App = () => {
    return (
      <KeepAliveLayout keepalivePaths={['/']}>
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
  `

  try {
    if (!existsSync(appData.paths.absTempPath)) {
      await mkdir(appData.paths.absTempPath)
    }

    await writeFile(appData.paths.absEntryPath, content, 'utf-8')
  } catch (e) {
    console.error('生成index失败', e)
  }
}

/**
 * 生成入口html
 */
export async function generateHtml({
  appData,
  esbuildPort,
}: {
  appData: IAppData
  esbuildPort: number
}) {
  // 客户端的css在ts中引入后会被esbuild打包为index.css，ts会被esbuild打包为index.js，伪热更新hot-reloading.js文件打包在lib/client/hot-reloading.js
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>${appData.pkg.name || 'Emi'}</title>
        <link rel="stylesheet" href="http://${DEFAULT_DEV_HOST}:${esbuildPort}/index.css"></link>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
        </div>

        <script src="http://${DEFAULT_DEV_HOST}:${esbuildPort}/index.js"></script>
        <script src="/client/hot-reloading.js"></script>
    </body>
    </html>
    `

  try {
    if (!existsSync(appData.paths.absTempPath)) {
      await mkdir(appData.paths.absTempPath)
    }

    await writeFile(
      path.join(appData.paths.absOutputPath, 'index.html'),
      content,
      'utf-8',
    )
  } catch (e) {
    console.error('生成html失败', e)
  }

  return content
}
