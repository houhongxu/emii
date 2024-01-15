import { Command } from 'commander'
import {
  CONFIG_REBUILD_EVENT,
  DEFAULT_DEV_PORT,
  DEFAULT_ESBUILD_CONFIG_PORT,
  DEFAULT_ESBUILD_INDEX_PORT,
  DEFAULT_MOCK_PATH,
  DEFAULT_MOCK_PORT,
} from '../../../constants'
import { getAppData } from '../../../appData'
import { EmiEmitter, EmiGlobal, findPort, isEmptyObject } from '../../../utils'
import { createDevKoaApp, esbuildServe, logListenInfo } from './server'
import { getUserConfig } from '../../../config'
import { getRoutes } from '../../../routes'
import { generateHtml, generateIndex } from './generate'
import { IAppData } from '../../../types'
import http from 'http'
import proxy from 'koa-proxies'
import { esbuildRebuildPlugin } from '../../../plugins'
import { getMockConfig, getMockPaths } from '../../../mock'
import bodyParser from 'koa-bodyparser'
import createDestrou from 'http-destroy'

export const dev = new Command('dev')

dev
  .option('-p,--port <value>', 'log it', DEFAULT_DEV_PORT.toString())
  .action(async (options) => {
    const port = options.port as string
    const cwd = process.cwd()

    // 寻找可用端口
    const koaPort = await findPort(parseInt(port))
    const esbuildIndexPort = await findPort(DEFAULT_ESBUILD_INDEX_PORT)
    const esbuildConfigPort = await findPort(DEFAULT_ESBUILD_CONFIG_PORT)
    const esbuildMockPort = await findPort(DEFAULT_MOCK_PORT)

    // 获取全局数据
    const appData = await getAppData({ cwd })

    try {
      // 开启esbuild的入口服务给koa
      await esbuildServe({
        platform: 'browser',
        outfileName: 'index.js',
        entryPoints: [appData.paths.absEntryPath],
        port: esbuildIndexPort,
        appData,
      })

      // 开启esbuild的配置文件服务给koa
      await esbuildServe({
        platform: 'node',
        outfileName: 'config.js',
        entryPoints: [appData.paths.absConfigPath],
        port: esbuildConfigPort,
        appData,
        plugins: [esbuildRebuildPlugin],
      })

      const mockPath = getMockPaths({ appData })

      // 开启esbuild的mock文件服务给koa
      await esbuildServe({
        platform: 'node',
        outdirName: DEFAULT_MOCK_PATH,
        entryPoints: mockPath,
        port: esbuildMockPort,
        appData,
        plugins: [esbuildRebuildPlugin],
      })

      // 通过koa提供的dev服务，koa转发esbuild的服务提供index与config文件的sse事件伪热更新
      let server = await devWithRebuild({
        appData,
        koaPort,
        esbuildIndexPort,
        esbuildConfigPort,
      })

      // 配置文件更新后重新构建，根据配置情况重启dev服务
      EmiEmitter.on(CONFIG_REBUILD_EVENT, async () => {
        console.log('<=== 重启服务中 ===>')

        // 如果是重新构建，则使用全局保存的上一次服务
        server = EmiGlobal.EmiDevServer ?? server

        const nextServer = await devWithRebuild({
          appData,
          preServer: server,
          koaPort,
          esbuildConfigPort,
          esbuildIndexPort,
        })

        EmiGlobal.EmiDevServer = nextServer

        console.log('<=== 重启成功 ===>')
      })
    } catch (e) {
      console.log('服务开启失败', e)
      process.exit(1)
    }
  })

/**
 * 重新构建相关的dev服务
 */
async function devWithRebuild({
  appData,
  preServer,
  koaPort,
  esbuildConfigPort,
  esbuildIndexPort,
}: {
  appData: IAppData
  preServer?: http.Server
  koaPort: number
  esbuildConfigPort: number
  esbuildIndexPort: number
}) {
  // 获取用户配置
  const userConfig = await getUserConfig({ appData })
  console.log('用户配置：', userConfig)

  // 获取路由数据
  const routes = await getRoutes({ appData })

  // 生成入口index
  await generateIndex({ appData, routes, userConfig })

  // 生成入口html
  await generateHtml({ appData, userConfig })

  // 获取mock配置
  const mockConfig = getMockConfig({ appData })
  console.log('mock配置：', mockConfig)

  // 获取代理配置
  const proxyConfig = userConfig.proxy ?? {}

  // 创建koa app
  const app = createDevKoaApp({
    esbuildIndexPort,
    esbuildConfigPort,
    appData,
  })

  if (!isEmptyObject(mockConfig) || !isEmptyObject(proxyConfig)) {
    // 有服务则先终止上一次服务
    if (preServer) {
      // close会延迟koa终止服务等待链接都关闭，立刻终止koa服务见https://github.com/koajs/koa/issues/659，httpTerminator为类似库
      await preServer.destroy()
    }

    // 有代理配置添加代理中间件
    if (!isEmptyObject(proxyConfig)) {
      Object.entries(proxyConfig).forEach(([path, options]) => {
        app.use(proxy(path, options))
      })
    }

    // 有mock配置则添加mock中间件
    if (!isEmptyObject(mockConfig)) {
      app.use(bodyParser())

      app.use(async (ctx, next) => {
        const handler = mockConfig?.[ctx.method]?.[ctx.url]

        if (
          typeof handler === 'string' ||
          Array.isArray(handler) ||
          Object.prototype.toString.call(handler) === '[object Object]'
        ) {
          ctx.body = handler
        } else if (typeof handler === 'function') {
          handler(ctx)
        } else {
          await next()
        }
      })
    }
  }

  // 开启koa服务
  const nextServer = app.listen(koaPort, () => {
    logListenInfo(koaPort)
  })

  return createDestrou(nextServer)
}
