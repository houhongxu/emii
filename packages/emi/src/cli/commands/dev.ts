import { Command } from 'commander'
import Koa from 'koa'
import { BuildContext, context, ServeOnRequestArgs } from 'esbuild'
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTDIR,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT,
} from '../../constants/index'
import path from 'path'
import portfinder from 'portfinder'

const app = new Koa()

app.use((ctx) => {
  ctx.set('Content-Type', 'text/html')

  ctx.body = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Emi</title>
    </head>
    
    <body>
        <div id="root">
            <span>loading...</span>
            <script src="http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}/index.js"></script>
        </div>
    </body>
    </html>`
})

export const dev = new Command('dev')

dev
  .option('-p,--port <value>', 'log it', DEFAULT_PORT.toString())
  .action(async (options) => {
    const port = options.port as string

    // 寻找可用端口
    const newPort = await findPort(parseInt(port))

    try {
      // 开启koa的服务给浏览器
      await devListen(newPort)

      // 开启esbuild的服务给koa，koa使用html拼接script服务esbuild打包的js返回改浏览器
      const ctx = await devBuild()

      // 实现ctrlc和kill退出
      process.on('SIGINT', () => {
        ctx.dispose()
        process.exit(0)
      })

      process.on('SIGTERM', () => {
        ctx.dispose()
        process.exit(0)
      })
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })

async function devListen(port: number) {
  return new Promise((resolve) => {
    app.listen(port, async () => {
      console.log(`App listening at http://${DEFAULT_HOST}:${port}`)
      resolve(port)
    })
  })
}

async function devBuild() {
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
    entryPoints: [path.resolve(process.cwd(), DEFAULT_ENTRY_POINT)],
  })

  await ctx.serve({
    servedir: DEFAULT_OUTDIR,
    port: DEFAULT_BUILD_PORT,
    host: DEFAULT_HOST,
    onRequest: (args: ServeOnRequestArgs) => {
      console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`)
    },
  })

  return ctx
}

async function findPort(port: number) {
  const newPort = await portfinder.getPortPromise({ port: port })

  return newPort
}

// ---------
