import StaticMiddleware from '../../../compiled/koa-static'
import path from 'path'
import { IAppData } from '../types'

export const getStaticHtmlMiddleware = ({ appData }: { appData: IAppData }) =>
  // 静态资源服务index.html
  StaticMiddleware(appData.paths.absTempPath)

export const StaticClientMiddleware =
  // 静态资源服务hot-reloading.js，打包后路径为lib/node/cli.js，根据该路径将根路径配置为lib下
  StaticMiddleware(path.join(__dirname, '../client'))
