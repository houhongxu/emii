import path from 'path'
import {
  DEFAULT_ENTRY_PATH,
  DEFAULT_LAYOUT_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_TEMPORARY_PATH,
} from './constants'
import pkg from '../../package.json'
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

    const absPagesPath = path.join(absSrcPath, 'pages')
    const absTempPath = path.join(absNodeModulesPath, DEFAULT_TEMPORARY_PATH)
    const absEntryPath = path.join(absTempPath, DEFAULT_ENTRY_PATH)

    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTempPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath,
      absLayoutPath,
    }

    resolve({ paths, pkg })
  })
}
