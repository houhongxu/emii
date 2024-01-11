import Koa from 'koa'
import { context, ServeOnRequestArgs } from 'esbuild'
import { IAppData } from '../../../types'
import staticMiddleware from 'koa-static'
import http from 'http'
import path from 'path'
import { DEFAULT_DEV_HOST, DEFAULT_OUTPUT_PATH } from '../../../constants'
import { generateHtml, generateIndex } from './generate'
import { getRoutes } from '../../../routes'

export async function createEmiServer({
  koaPort,
  esbuildPort,
  appData,
}: {
  koaPort: number
  esbuildPort: number
  appData: IAppData
}) {
  // 获取路由数据
  const routes = await getRoutes({ appData })

  // 生成入口index
  await generateIndex({ appData, routes })

  // 生成并获取入口html
  const html = await generateHtml({ appData, esbuildPort })

  // 开启esbuild的服务给koa
  await devESBuildServe({ esbuildPort, appData })

  // 开启koa的服务给浏览器，使用html，拼接esbuild打包的js的script，返回给浏览器
  await devKoaServe({ koaPort, esbuildPort, html })
}

/**
 * dev esbuild监听与服务
 * @description https://esbuild.github.io/api/#live-reload
 */
async function devESBuildServe({
  esbuildPort,
  appData,
}: {
  esbuildPort: number
  appData: IAppData
}) {
  const esbuildServePath = path.join(appData.paths.absTempPath, '.esbuild')
  const ctx = await context({
    platform: 'browser',
    outdir: esbuildServePath,
    entryNames: 'index',
    bundle: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    entryPoints: [appData.paths.absEntryPath],
    tsconfig: path.join(appData.paths.cwd, 'tsconfig.json'),
  })

  // watch用于监听文件变动后发送reload事件
  await ctx.watch()

  // serve用于将打包的js放于服务器并返回最新的打包结果
  await ctx.serve({
    servedir: esbuildServePath,
    host: DEFAULT_DEV_HOST,
    port: esbuildPort,
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
}

/**
 * dev服务
 * @description 由于使用koa返回html加js，所以需要代理esbuild的live-reloading返回的SSE事件等：https://esbuild.github.io/api/#serve-proxy
 */
async function devKoaServe({
  koaPort,
  esbuildPort,
  html,
}: {
  koaPort: number
  esbuildPort: number
  html: string
}) {
  const app = new Koa()

  // 静态资源服务，打包后路径为lib/node/cli.js，根据该路径将根路径配置为lib下，用于访问hot-reloading.js
  app.use(staticMiddleware(path.join(__dirname, '../')))

  // 服务端渲染服务，返回拼接了加载静态资源代码的html
  app.use(async (ctx, next) => {
    if (ctx.url === '/') {
      ctx.set('Content-Type', 'text/html')

      ctx.body = html
    } else if (ctx.url.includes('favicon')) {
      ctx.body = ''
    } else {
      // 代理
      await next()
    }
  })

  // 代理esbuild服务，返回其sse事件
  app.use(async (ctx) => {
    const options = {
      hostname: DEFAULT_DEV_HOST,
      port: esbuildPort,
      path: ctx.req.url,
      method: ctx.req.method,
      headers: ctx.req.headers,
    }

    await new Promise((resolve, reject) => {
      const proxyReq = http.request(options, (proxyRes) => {
        ctx.status = proxyRes.statusCode ?? 200
        ctx.set(proxyRes.headers as Record<string, string>)
        ctx.body = proxyRes
        resolve('success')
      })

      proxyReq.on('error', reject)

      ctx.req.pipe(proxyReq)
    })
  })

  return new Promise((resolve) => {
    app.listen(koaPort, async () => {
      console.log(`App listening at http://${DEFAULT_DEV_HOST}:${koaPort}`)
      resolve(koaPort)
    })
  })
}
