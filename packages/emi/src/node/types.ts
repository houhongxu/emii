export type INoop = () => void

export interface IAppData {
  paths: {
    /**
     * 当前绝对路径
     */
    cwd: string
    /**
     * src路径
     */
    absSrcPath: string
    /**
     * pages路径
     */
    absPagesPath: string
    /**
     * 临时文件夹路径
     */
    absTempPath: string
    /**
     * 打包路径
     */
    absOutputPath: string
    /**
     * 入口路径
     */
    absEntryPath: string
    /**
     * nodemodules路径
     */
    absNodeModulesPath: string
    /**
     * layout路径
     */
    absLayoutPath: string
  }
  pkg: any
}

export interface IRoute {
  element: any
  path: string
  routes?: IRoute[]
}
