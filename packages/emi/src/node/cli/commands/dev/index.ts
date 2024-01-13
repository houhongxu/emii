import { Command } from 'commander'
import {
  CONFIG_REBUILD_EVENT,
  DEFAULT_DEV_PORT,
  DEFAULT_ESBUILD_CONFIG_PORT,
  DEFAULT_ESBUILD_INDEX_PORT,
} from '../../../constants'
import { getAppData } from '../../../appData'
import { EmiEmitter, EmiGlobal, findPort } from '../../../utils'
import { createDevKoaApp, esbuildServe, logListenInfo } from './server'
import { getUserConfig } from '../../../config'
import { getRoutes } from '../../../routes'
import { generateHtml, generateIndex } from './generate'
import { IAppData } from '../../../types'
import http from 'http'
import proxy from 'koa-proxies'
import { esbuildRebuildPlugin } from '../../../plugins'
import { createHttpTerminator } from 'http-terminator'

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

    // 获取全局数据
    const appData = await getAppData({ cwd })

    try {
      // 通过koa提供的dev服务，koa转发esbuild的服务提供index与config文件的sse事件伪热更新

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
      let server = await devWithUserConfig({
        appData,
        koaPort,
        esbuildIndexPort,
        esbuildConfigPort,
      })

      // 配置文件更新后重新构建，根据配置情况重启dev服务
      EmiEmitter.on(CONFIG_REBUILD_EVENT, async () => {
        // 如果是重新构建，则使用全局保存的上一次服务
        server = EmiGlobal.EmiDevServer ?? server

        const nextServer = await devWithUserConfig({
          appData,
          server,
          koaPort,
          esbuildConfigPort,
          esbuildIndexPort,
        })

        EmiGlobal.EmiDevServer = nextServer
      })
    } catch (e) {
      console.log('服务开启失败', e)
      process.exit(1)
    }
  })

/**
 * 用户配置相关的dev服务
 */
async function devWithUserConfig({
  appData,
  server,
  koaPort,
  esbuildConfigPort,
  esbuildIndexPort,
}: {
  appData: IAppData
  server?: http.Server
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

  // 创建koa app
  const app = createDevKoaApp({
    esbuildIndexPort,
    esbuildConfigPort,
    appData,
  })

  // 有代理则添加中间件
  const proxyConfig = userConfig.proxy
  if (proxyConfig) {
    // 有服务则先终止上一次服务
    if (server) {
      const httpTerminator = createHttpTerminator({ server })

      // close会延迟koa终止服务等待链接都关闭，立刻终止koa服务见https://github.com/koajs/koa/issues/659，httpTerminator为类似库
      await httpTerminator.terminate()
    }

    // 添加代理中间件
    Object.entries(proxyConfig).forEach(([path, options]) => {
      app.use(proxy(path, options))
    })
  }

  // 开启koa服务
  const nextServer = app.listen(koaPort, () => {
    logListenInfo(koaPort)
  })

  return nextServer
}
