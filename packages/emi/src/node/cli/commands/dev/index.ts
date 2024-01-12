import { Command } from 'commander'
import {
  CONFIG_REBUILD_EVENT,
  DEFAULT_DEV_PORT,
  DEFAULT_ESBUILD_CONFIG_PORT,
  DEFAULT_ESBUILD_INDEX_PORT,
} from '../../../constants'
import { getAppData } from '../../../appData'
import { EmiEmitter, findPort } from '../../../utils'
import { createEmiServer } from './server'
import { getUserConfig } from '../../../config'
import { getRoutes } from '../../../routes'
import { generateHtml, generateIndex } from './generate'
import { IAppData, IRoute } from '../../../types'

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

    // 配置文件更新后重新构建
    EmiEmitter.on(CONFIG_REBUILD_EVENT, async () => {
      await buildWithUserConfig({
        appData,
      })
    })

    try {
      createEmiServer({
        koaPort,
        appData,
        esbuildConfigPort,
        esbuildIndexPort,
      })
    } catch (e) {
      console.log('服务开启失败', e)
      process.exit(1)
    }
  })

async function buildWithUserConfig({ appData }: { appData: IAppData }) {
  // 获取用户配置
  const userConfig = await getUserConfig({ appData })
  console.log('用户配置：', userConfig)

  // 获取路由数据
  const routes = await getRoutes({ appData })

  // 生成入口index
  await generateIndex({ appData, routes, userConfig })

  // 生成入口html
  await generateHtml({ appData, userConfig })
}
