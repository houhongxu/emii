import { program } from 'commander'
import path from 'path'
import { copy, ensureDir, readdir } from 'fs-extra'

const COMPILE_PATH = 'compiled'

export const cli = program

cli
  .name('compile')
  .description('CLI to compile')
  .argument('<value>', 'compiled package , like packages/emii')
  .action(async (argument) => {
    const cwd = process.cwd()
    const pkg = argument

    const absPkgPath = path.join(cwd, pkg)

    const absNodeModulesPath = path.join(absPkgPath, 'node_modules')
    const absTypesPath = path.join(absNodeModulesPath, '@types')

    const moduleNames = await readdir(absNodeModulesPath)
    const typesNames = await readdir(absTypesPath)

    const excludes = ['.bin', '@types']

    for (const moduleName of moduleNames) {
      if (excludes.includes(moduleName)) continue

      // 拷贝包
      const absModulePath = path.join(absNodeModulesPath, moduleName)

      const absCompiledModulePath = path.join(
        absPkgPath,
        COMPILE_PATH,
        moduleName,
      )

      await compile(absModulePath, absCompiledModulePath)

      // 拷贝类型文件到包中
      if (typesNames.includes(moduleName)) {
        const absTypePath = path.join(absTypesPath, moduleName)
        const absDTSPath = path.join(absTypePath, 'index.d.ts')

        await copy(absDTSPath, path.join(absCompiledModulePath, 'index.d.ts'), {
          overwrite: true,
          dereference: true, // 不复制pnpm软连接而是真实文件
        })
      }
    }

    console.log(`成功`)
  })

cli.parse()

/**
 * 使用拷贝方式保留dts，暂不使用再次打包的方式
 */
async function compile(absModulePath: string, absCompiledModulePath: string) {
  await copy(absModulePath, absCompiledModulePath, {
    overwrite: true,
    dereference: true, // 不复制pnpm软连接而是真实文件
  })
}
