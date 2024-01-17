import Koa from '../../../compiled/koa'

export const InterceptMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  console.log('请求路径：', ctx.url)

  if (ctx.url.includes('favicon')) {
    ctx.body = ''
  }

  await next()
}
