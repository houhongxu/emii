import { existsSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { IAppData, IRoute } from './types'

/**
 * 获取路由
 */

export function getRoutes({
  appData,
}: {
  appData: IAppData
}): Promise<IRoute[]> {
  return new Promise((resolve, reject) => {
    const files = getFiles(appData.paths.absPagesPath)
    const routes = filesToRoutes(files, appData.paths.absPagesPath)

    // 包裹全局layout
    const absLayoutPath = appData.paths.absLayoutPath

    if (existsSync(absLayoutPath)) {
      resolve([
        {
          path: '/',
          element: absLayoutPath.replace(path.extname(absLayoutPath), ''),
          routes,
        },
      ])
    } else {
      resolve(routes)
    }
  })
}

/**
 * 获取文件路径，当前仅支持一级tsx文件
 */
function getFiles(root: string) {
  if (!existsSync(root)) return []

  return readdirSync(root).filter((file) => {
    const absFilePath = path.join(root, file)
    const fileStat = statSync(absFilePath)
    const isFile = fileStat.isFile()

    if (isFile) {
      if (!/\.tsx?$/.test(file)) {
        return false
      } else {
        return true
      }
    }
  })
}

/**
 * 文件转路由
 */
function filesToRoutes(files: string[], pagesPath: string): IRoute[] {
  return files.map((i) => {
    // 获取不带扩展名的文件名
    let pagePath = path.basename(i, path.extname(i))

    // 获取元素文件的导入路径
    const element = path.resolve(pagesPath, pagePath)

    // TODO
    if (pagePath === 'hello') pagePath = ''

    return {
      path: `/${pagePath}`,
      element,
    }
  })
}
