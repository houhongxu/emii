import { Command } from 'commander'
import Koa from 'koa'
import { context, ServeOnRequestArgs } from 'esbuild'
import {
  DEFAULT_ENTRY_PATH,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_DEV_HOST,
  DEFAULT_DEV_PORT,
  DEFAULT_ESBUILD_PORT,
} from '../../constants'
import path from 'path'
import portfinder from 'portfinder'
import staticMiddleware from 'koa-static'
import http from 'http'
import { getAppData } from '../../appData'
import { getRoutes } from '../../routes'

export const dev = new Command('dev')

dev
  .option('-p,--port <value>', 'log it', DEFAULT_DEV_PORT.toString())
  .action(async (options) => {
    const port = options.port as string
    const cwd = process.cwd()

    // const appData = await getAppData({ cwd })
    // console.log(appData)
    // const routes = await getRoutes({ appData })
    // console.log(JSON.stringify(routes))

    // 寻找可用端口
    const koaPort = await findPort(parseInt(port))
    const esbuildPort = await findPort(DEFAULT_ESBUILD_PORT)

    try {
      // 开启koa的服务给浏览器
      await devKoaServe(koaPort, esbuildPort)

      // 开启esbuild的服务给koa，koa使用html拼接script服务esbuild打包的js返回改浏览器
      await devESBuildServe(esbuildPort)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })

/**
 * dev服务器
 * @description 由于使用koa返回html加js，所以需要代理esbuild的live-reloading返回的SSE事件等：https://esbuild.github.io/api/#serve-proxy
 */
async function devKoaServe(koaPort: number, esbuildPort: number) {
  const app = new Koa()

  // 静态资源服务，打包后路径为lib/node/cli.js，根据该路径将根路径配置为lib下
  app.use(staticMiddleware(path.join(__dirname, '../')))

  // 服务端渲染服务，返回拼接了加载静态资源代码的html
  app.use(async (ctx, next) => {
    if (ctx.url === '/') {
      ctx.set('Content-Type', 'text/html')

      // 客户端的css在ts中引入后会被esbuild打包为index.css，ts会被esbuild打包为index.js
      // css热更新文件打包在lib/client/hot-reloading.js
      ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Emi</title>
        <link rel="stylesheet" href="http://${DEFAULT_DEV_HOST}:${esbuildPort}/index.css"></link>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
        </div>

        <script src="http://${DEFAULT_DEV_HOST}:${esbuildPort}/index.js"></script>
        <script src="/client/hot-reloading.js"></script>
    </body>
    </html>
    `
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

/**
 * esbuild监听与服务
 * @description https://esbuild.github.io/api/#live-reload
 */
async function devESBuildServe(esbuildPort: number) {
  const ctx = await context({
    outdir: DEFAULT_OUTPUT_PATH,
    bundle: true,
    format: 'iife',
    logLevel: 'error',
    platform: 'browser',
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    // 在命令执行的路径查找入口
    entryPoints: [path.resolve(DEFAULT_ENTRY_PATH)],
  })

  // watch用于监听文件变动后发送reload事件
  await ctx.watch()

  // serve用于将打包的js放于服务器并返回最新的打包结果
  await ctx.serve({
    servedir: DEFAULT_OUTPUT_PATH,
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
 *
 * 查找可用端口
 */
async function findPort(port: number) {
  const newPort = await portfinder.getPortPromise({ port: port })

  return newPort
}
