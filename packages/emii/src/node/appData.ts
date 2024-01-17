import path from 'path'
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_ENTRY_PATH,
  DEFAULT_ESBUILD_SERVE_PATH,
  DEFAULT_LAYOUT_PATH,
  DEFAULT_MOCK_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH,
} from './constants'
import { IAppData } from './types'

interface IOptions {
  cwd: string
}

/**
 * 获取应用生命周期数据
 */
export function getAppData({ cwd }: IOptions): Promise<IAppData> {
  return new Promise((resolve, reject) => {
    const absSrcPath = path.join(cwd, 'src')
    const absNodeModulesPath = path.join(cwd, 'node_modules')
    const absOutputPath = path.join(cwd, DEFAULT_OUTPUT_PATH)
    const absLayoutPath = path.join(cwd, DEFAULT_LAYOUT_PATH)
    const absConfigPath = path.join(cwd, DEFAULT_CONFIG_PATH)
    const absMockPath = path.join(cwd, DEFAULT_MOCK_PATH)

    const absPagesPath = path.join(absSrcPath, 'pages')
    const absTempPath = path.join(absNodeModulesPath, DEFAULT_TEMPORARY_PATH)
    const absEntryPath = path.join(absTempPath, DEFAULT_ENTRY_PATH)
    const absEsbuildServePath = path.join(
      absTempPath,
      DEFAULT_ESBUILD_SERVE_PATH,
    )
    const absHtmlPath = path.join(absTempPath, 'index.html')

    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTempPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath,
      absLayoutPath,
      absConfigPath,
      absEsbuildServePath,
      absHtmlPath,
      absMockPath,
    }

    resolve({ paths, pkg: require('../../package.json') })
  })
}
