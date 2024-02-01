import { Command } from '../../../../../compiled/commander'
import { DEFAULT_OUTPUT_PATH } from '../../../constants'
import { getAppData } from '../../../appData'
import { getUserConfig } from '../../../config'
import { getRoutes } from '../../../routes'
import { generateHtml, generateIndex } from '../../../generate'
import esbuild from 'esbuild'
import path from 'path'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'

export const build = new Command('build')

build
  .option('-o,--outdir <value>', 'output dir', DEFAULT_OUTPUT_PATH)
  .action(async (options) => {
    const outdir = options.outdir as string

    const cwd = process.cwd()

    // 获取全局数据
    const appData = await getAppData({ cwd })

    // 获取用户配置
    const userConfig = await getUserConfig({ appData })

    // 获取路由数据
    const routes = await getRoutes({ appData })

    // 生成入口index
    await generateIndex({ appData, routes, userConfig })

    // 生成入口html
    await generateHtml({ appData, userConfig, isProduction: true })

    if (!existsSync(appData.paths.absOutputPath)) {
      await mkdir(appData.paths.absOutputPath)
    }

    // 执行构建
    await esbuild.build({
      format: 'iife',
      outfile: path.join(appData.paths.absOutputPath, 'index.js'),
      platform: 'browser',
      bundle: true,
      minify: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      entryPoints: [appData.paths.absEntryPath],
      tsconfig: path.join(appData.paths.cwd, 'tsconfig.json'),
    })
  })
