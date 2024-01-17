import Koa from '../../../compiled/koa'
import http from 'http'
import { DEFAULT_DEV_HOST } from '../constants'

export const getEsbuildProxyMiddleware =
  (esbuildIndexPort: number, esbuildConfigPort: number) =>
  async (ctx: Koa.Context, next: Koa.Next) => {
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

    await next()
  }
