import Koa from 'koa'
import { IAppData } from '../../../types'
import path from 'path'
import { DEFAULT_DEV_HOST } from '../../../constants'
import { BuildOptions, ServeOnRequestArgs, context } from 'esbuild'
import {
  InterceptMiddleware,
  StaticClientMiddleware,
  getEsbuildProxyMiddleware,
  getStaticHtmlMiddleware,
} from '../../../middlewares'

/**
 * dev服务
 * @description 由于使用koa返回html加js，所以需要代理esbuild的live-reloading返回的SSE事件等：https://esbuild.github.io/api/#serve-proxy
 */
export function createDevKoaApp({
  esbuildIndexPort,
  esbuildConfigPort,
  appData,
}: {
  esbuildIndexPort: number
  esbuildConfigPort: number
  appData: IAppData
}): Koa<Koa.DefaultState, Koa.DefaultContext> {
  const app = new Koa()

  // 拦截请求
  app.use(InterceptMiddleware)

  // 静态资源
  app.use(getStaticHtmlMiddleware({ appData }))
  app.use(StaticClientMiddleware)

  // 代理多个esbuild服务，返回其sse事件
  app.use(getEsbuildProxyMiddleware(esbuildIndexPort, esbuildConfigPort))

  return app
}

/**
 * esbuild监听与服务
 * @description https://esbuild.github.io/api/#live-reload
 */
export async function esbuildServe({
  platform,
  outfileName,
  outdirName,
  entryPoints,
  port,
  appData,
  plugins,
}: {
  platform: BuildOptions['platform']
  /**
   * 单文件时，文件名包括后缀
   */
  outfileName?: string
  /**
   * 多文件时，目录
   */
  outdirName?: string
  entryPoints: BuildOptions['entryPoints']
  port: number
  appData: IAppData
  plugins?: BuildOptions['plugins']
}) {
  const ctx = await context({
    ...(outfileName
      ? outfileName && {
          outfile: path.join(appData.paths.absEsbuildServePath, outfileName),
        }
      : outdirName && {
          outdir: path.join(appData.paths.absEsbuildServePath, outdirName),
        }),
    platform,
    bundle: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    entryPoints,
    tsconfig: path.join(appData.paths.cwd, 'tsconfig.json'),
    plugins,
  })

  // watch用于监听文件变动后发送reload事件
  await ctx.watch()

  // serve用于将打包的js放于服务器并返回最新的打包结果
  const serveRes = await ctx.serve({
    servedir: appData.paths.absEsbuildServePath,
    host: DEFAULT_DEV_HOST,
    port,
    onRequest: (args: ServeOnRequestArgs) => {
      console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`)
    },
  })

  // 实现ctrlc和kill退出
  process.on('SIGINT', () => {
    ctx.dispose()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    ctx.dispose()
    process.exit(0)
  })

  return serveRes
}

/**
 * log dev服务信息
 */
export function logListenInfo(port: number) {
  console.log(`App listening at http://${DEFAULT_DEV_HOST}:${port}`)
}
