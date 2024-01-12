import Koa from 'koa'
import { IAppData, IUserConfig } from '../../../types'
import staticMiddleware from 'koa-static'
import http from 'http'
import path from 'path'
import { DEFAULT_DEV_HOST } from '../../../constants'
import { esbuildServe } from '../../../esbuildServe'
import { esbuildRebuildPlugin } from '../../../plugins'

/**
 * 通过koa提供的dev服务，koa转发esbuild的服务提供index与config文件的sse事件伪热更新
 */
export async function createEmiServer({
  koaPort,
  appData,
  esbuildIndexPort,
  esbuildConfigPort,
}: {
  koaPort: number
  appData: IAppData
  esbuildIndexPort: number
  esbuildConfigPort: number
}) {
  // 开启esbuild的入口服务给koa
  await esbuildServe({
    platform: 'browser',
    outfileName: 'index.js',
    entry: appData.paths.absEntryPath,
    port: esbuildIndexPort,
    appData,
  })

  // 开启esbuild的配置文件服务给koa
  await esbuildServe({
    platform: 'node',
    outfileName: 'config.js',
    entry: appData.paths.absConfigPath,
    port: esbuildConfigPort,
    appData,
    plugins: [esbuildRebuildPlugin],
  })

  // 开启koa的服务给浏览器，使用html，拼接esbuild打包的js的script，返回给浏览器
  await devKoaServer({
    port: koaPort,
    esbuildIndexPort,
    esbuildConfigPort,
    appData,
  })
}

/**
 * dev服务
 * @description 由于使用koa返回html加js，所以需要代理esbuild的live-reloading返回的SSE事件等：https://esbuild.github.io/api/#serve-proxy
 */
async function devKoaServer({
  port,
  esbuildIndexPort,
  esbuildConfigPort,
  appData,
}: {
  port: number
  esbuildIndexPort: number
  esbuildConfigPort: number
  appData: IAppData
}) {
  const app = new Koa()

  // 静态资源服务index.html
  app.use(staticMiddleware(path.join(appData.paths.absTempPath)))
  // 静态资源服务hot-reloading.js，打包后路径为lib/node/cli.js，根据该路径将根路径配置为lib下
  app.use(staticMiddleware(path.join(__dirname, '../')))

  // 拦截请求
  app.use(async (ctx, next) => {
    console.log('请求路径：', ctx.url)

    if (ctx.url.includes('favicon')) {
      ctx.body = ''
    } else {
      // 代理
      await next()
    }
  })

  // 代理多个esbuild服务，返回其sse事件
  app.use(async (ctx) => {
    /**
     * 代理esbuild服务
     */
    const proxyEsbuldServe = async (options: http.RequestOptions) => {
      await new Promise((resolve, reject) => {
        const proxyReq = http.request(options, (proxyRes) => {
          ctx.status = proxyRes.statusCode ?? 200
          ctx.set(proxyRes.headers as Record<string, string>)

          // 将静态资源服务器的响应转发到 Koa 的响应中
          proxyRes.pipe(ctx.res)

          proxyRes.on('end', () => {
            resolve('end')
          })
        })

        // 将 Koa 的请求转发到静态资源服务器
        ctx.req.pipe(proxyReq)

        proxyReq.on('error', () => {
          console.error('koa代理esbuild出错')
          reject()
        })
      })
    }

    const indexUrls = ['/esbuildIndex', '/index.js', 'index.css']
    if (indexUrls.some((url) => ctx.url.includes(url))) {
      // sse事件路径为固定值
      const path = ctx.url === '/esbuildIndex' ? '/esbuild' : ctx.url
      await proxyEsbuldServe({
        hostname: DEFAULT_DEV_HOST,
        port: esbuildIndexPort,
        path,
        method: ctx.req.method,
        headers: ctx.req.headers,
      })
    }

    if (ctx.url === '/esbuildConfig') {
      await proxyEsbuldServe({
        hostname: DEFAULT_DEV_HOST,
        port: esbuildConfigPort,
        path: '/esbuild',
        method: ctx.req.method,
        headers: ctx.req.headers,
      })
    }
  })

  return new Promise((resolve) => {
    const server = app.listen(port, async () => {
      console.log(`App listening at http://${DEFAULT_DEV_HOST}:${port}`)

      resolve(port)
    })

    // 实现ctrlc和kill退出
    process.on('SIGINT', () => {
      server.close()
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      server.close()
      process.exit(0)
    })
  })
}
