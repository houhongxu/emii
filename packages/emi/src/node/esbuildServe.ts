import { BuildOptions, ServeOnRequestArgs, context } from 'esbuild'
import { DEFAULT_DEV_HOST } from './constants'
import path from 'path'
import { IAppData } from './types'

/**
 * esbuild监听与服务
 * @description https://esbuild.github.io/api/#live-reload
 */
export async function esbuildServe({
  platform,
  outfileName,
  entry,
  port,
  appData,
  plugins,
}: {
  platform: BuildOptions['platform']
  /**
   * 包括后缀
   */
  outfileName: string
  entry: string
  port: number
  appData: IAppData
  plugins?: BuildOptions['plugins']
}) {
  const ctx = await context({
    platform,
    outfile: path.join(appData.paths.absEsbuildServePath, outfileName),
    bundle: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    entryPoints: [entry],
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
