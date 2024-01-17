import { glob } from 'glob'
import { IAppData, IMockType } from './types'
import path from 'path'
import { DEFAULT_MOCK_PATH } from './constants'
import { Context } from 'koa'

export function getMockPaths({ appData }: { appData: IAppData }) {
  const mockDir = appData.paths.absMockPath

  const mockTsFiles = glob.sync('**/*.ts', {
    cwd: mockDir,
  })

  const absMockPaths = mockTsFiles.map((file) => path.join(mockDir, file))

  return absMockPaths
}

export function getMockConfig({ appData }: { appData: IAppData }) {
  const mockOutDir = path.join(
    appData.paths.absEsbuildServePath,
    DEFAULT_MOCK_PATH,
  )

  const mockJsFiles = glob.sync('**/*.js', {
    cwd: mockOutDir,
  })

  const absMockPaths = mockJsFiles.map((file) => path.join(mockOutDir, file))

  const config = absMockPaths.reduce<IMockType>((p, c) => {
    const config = require(c).default

    // ! 删除缓存需要确保path不会被其他模块require，否则会内存泄漏
    delete require.cache[c]

    return { ...p, ...config }
  }, {})

  const formatedConfig = Object.entries(config).reduce<
    Record<string, IMockType>
  >((p, c) => {
    const [req, handler] = c
    const reqArr = req.split(' ')
    const method = reqArr[0]
    const url = reqArr[1]

    if (typeof handler !== 'function' && typeof handler !== 'object') {
      return p
    } else {
      if (!p[method]) p[method] = {}

      p[method][url] = handler

      return p
    }
  }, {})

  return formatedConfig
}
