import { Command } from 'commander'
import Koa from 'koa'
import { context, ServeOnRequestArgs } from 'esbuild'
import {
  DEFAULT_JS_ENTRY_POINT,
  DEFAULT_OUTDIR,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT,
} from '../../constants/index'
import path from 'path'
import portfinder from 'portfinder'
import staticMiddleware from 'koa-static'
import http from 'http'

export const dev = new Command('dev')

dev
  .option('-p,--port <value>', 'log it', DEFAULT_PORT.toString())
  .action(async (options) => {
    const port = options.port as string

    // 寻找可用端口
    const koaPort = await findPort(parseInt(port))
    const buildPort = await findPort(DEFAULT_BUILD_PORT)

    try {
      // 开启koa的服务给浏览器
      await devKoaServe(koaPort, buildPort)

      // 开启esbuild的服务给koa，koa使用html拼接script服务esbuild打包的js返回改浏览器
      await devBuildServe(buildPort)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })

// 由于使用koa返回html加js，所以需要代理esbuild的live-reloading返回的SSE事件等
// https://esbuild.github.io/api/#serve-proxy
async function devKoaServe(koaPort: number, buildPort: number) {
  const app = new Koa()

  app.use(staticMiddleware(path.resolve(__dirname, '../')))

  app.use(async (ctx, next) => {
    if (ctx.url === '/') {
      ctx.set('Content-Type', 'text/html')

      ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Emi</title>
        // 客户端的css在js中引入后会打包为index.css
        <link rel="stylesheet" href="http://${DEFAULT_HOST}:${buildPort}/index.css"></link>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
            <script src="http://${DEFAULT_HOST}:${buildPort}/index.js"></script>
            <script src="/client/hot-reloading.js"></script>
        </div>
    </body>
    </html>
    `
    } else if (ctx.url.includes('favicon')) {
      ctx.body = ''
    } else {
      await next()
    }
  })

  app.use(async (ctx) => {
    const options = {
      hostname: DEFAULT_HOST,
      port: buildPort,
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
      console.log(`App listening at http://${DEFAULT_HOST}:${koaPort}`)
      resolve(koaPort)
    })
  })
}

// https://esbuild.github.io/api/#live-reload
async function devBuildServe(buildPort: number) {
  const ctx = await context({
    outdir: DEFAULT_OUTDIR,
    bundle: true,
    format: 'iife',
    logLevel: 'error',
    platform: 'browser',
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    // 在命令执行的路径查找入口
    entryPoints: [path.join(process.cwd(), DEFAULT_JS_ENTRY_POINT)],
  })

  // watch用于监听文件变动后发送reload事件
  await ctx.watch()

  // serve用于将打包的js放于服务器并返回最新的打包结果
  await ctx.serve({
    servedir: DEFAULT_OUTDIR,
    host: DEFAULT_HOST,
    port: buildPort,
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

async function findPort(port: number) {
  const newPort = await portfinder.getPortPromise({ port: port })

  return newPort
}
