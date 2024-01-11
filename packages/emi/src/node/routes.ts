import path from 'path'
import { IAppData, IRoute } from './types'
import { existsSync, statSync } from 'fs'
import { readdir, stat } from 'fs/promises'

/**
 * 获取路由
 */

export async function getRoutes({
  appData,
}: {
  appData: IAppData
}): Promise<IRoute[]> {
  return new Promise(async (resolve, reject) => {
    const files = await getFiles(appData.paths.absPagesPath)
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
async function getFiles(root: string) {
  if (!existsSync(root)) return []

  const files = await readdir(root)
  const stats = await Promise.all(
    files.map((file) => {
      const absFilePath = path.join(root, file)
      return stat(absFilePath)
    }),
  )
  return files.filter((file, index) => {
    const isFile = stats[index].isFile()

    return isFile && /\.tsx?$/.test(file)
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
