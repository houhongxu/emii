import { program } from '../../../compiled/commander'
import { dev } from './commands'
import { build } from './commands'

// TODO 重构cli  作者推荐以单文件组织cli https://github.com/tj/commander.js/issues/983

export const cli = program

cli
  .name('emi')
  .description('CLI to emi')
  .version(require('../../../package.json').version, '-v,--version')

cli.addCommand(dev)
cli.addCommand(build)

cli.parse()
