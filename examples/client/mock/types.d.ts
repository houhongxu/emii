import type * as Koa from 'koa'

/**
 * Global declaration for the added properties to the 'ctx.request'
 */
declare module 'koa' {
  interface Request {
    body?: any
    rawBody: string
  }
}
