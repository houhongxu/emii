import { Command } from 'commander'
import { DEFAULT_DEV_PORT, DEFAULT_ESBUILD_PORT } from '../../../constants'
import { getAppData } from '../../../appData'
import { findPort } from '../../../utils'
import { createEmiServer } from './server'

export const dev = new Command('dev')

dev
  .option('-p,--port <value>', 'log it', DEFAULT_DEV_PORT.toString())
  .action(async (options) => {
    const port = options.port as string
    const cwd = process.cwd()

    // 寻找可用端口
    const koaPort = await findPort(parseInt(port))
    const esbuildPort = await findPort(DEFAULT_ESBUILD_PORT)

    // 获取全局数据
    const appData = await getAppData({ cwd })

    try {
      createEmiServer({
        koaPort,
        esbuildPort,
        appData,
      })
    } catch (e) {
      console.log('服务开启失败', e)
      process.exit(1)
    }
  })
