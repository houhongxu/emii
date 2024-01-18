import { program } from 'commander'
import path from 'path'
import { copy, readdir } from 'fs-extra'
import ncc from '@vercel/ncc'
import { writeFile } from 'fs-extra'
import { ensureDir } from 'fs-extra'
import { readFile } from 'fs-extra'

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

      // 拷贝@types/类型文件到包中
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
 * 使用ncc打包js，使用拷贝方式保留dts
 */
async function compile(absModulePath: string, absCompiledModulePath: string) {
  // 打包index.js，在package.json找不到main时会找index.js的
  const { code } = await ncc(absModulePath, {
    minify: true,
  })

  await ensureDir(absCompiledModulePath)
  await writeFile(path.join(absCompiledModulePath, 'index.js'), code, 'utf-8')

  // 拷贝类型
  const modulePkgJsonPath = path.join(absModulePath, 'package.json')
  const typesPath =
    require(modulePkgJsonPath).types || require(modulePkgJsonPath).typing

  if (typesPath) {
    await copy(
      path.join(absModulePath, typesPath),
      path.join(absCompiledModulePath, typesPath),
      {
        overwrite: true,
        dereference: true, // 不复制pnpm软连接而是真实文件
      },
    )
  }

  // 拷贝package.json并移除type:module
  const modulePkgJson = await require(modulePkgJsonPath)

  delete modulePkgJson['type']

  await writeFile(
    path.join(absCompiledModulePath, 'package.json'),
    JSON.stringify(modulePkgJson, null, 2),
    'utf-8',
  )
}
