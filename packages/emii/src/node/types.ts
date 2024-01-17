import { Context } from '../../compiled/koa'
import { IKoaProxiesOptions } from '../../compiled/koa-proxies'

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
     * 入口html路径
     */
    absHtmlPath: string

    /**
     * nodemodules路径
     */
    absNodeModulesPath: string

    /**
     * layout路径
     */
    absLayoutPath: string

    /**
     * config路径
     */
    absConfigPath: string

    /**
     * esbuild serve路径
     */
    absEsbuildServePath: string

    /**
     * mock路径
     */
    absMockPath: string
  }
  pkg: any
}

export interface IRoute {
  element: any
  path: string
  routes?: IRoute[]
}

export interface IUserConfig {
  title?: string
  keepalive?: (string | RegExp)[]
  proxy?: { [key: string]: IKoaProxiesOptions }
}

export type IMockType = Record<
  string,
  string | Array<any> | object | ((ctx: Context) => void)
>
