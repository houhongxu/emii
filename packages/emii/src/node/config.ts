import { IAppData, IUserConfig } from './types'
import path from 'path'
import { existsSync } from 'fs'

export async function getUserConfig({
  appData,
}: {
  appData: IAppData
}): Promise<IUserConfig> {
  const buildedConfigPath = path.join(
    appData.paths.absEsbuildServePath,
    'config.js',
  )

  try {
    if (existsSync(buildedConfigPath)) {
      const config = require(buildedConfigPath).default as IUserConfig

      // ! 删除缓存需要确保path不会被其他模块require，否则会内存泄漏
      delete require.cache[buildedConfigPath]

      return config
    } else {
      return {} as IUserConfig
    }
  } catch (e) {
    console.error('配置文件读取错误', e)
    process.exit(1)
  }
}
