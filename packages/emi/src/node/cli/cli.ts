import { program } from 'commander'
import { dev } from './commands'
import { build } from './commands'

export const cli = program

cli
  .name('emi')
  .description('CLI to emi')
  .version(require('../../../package.json').version, '-v,--version')

cli.addCommand(dev)
cli.addCommand(build)

cli.parse()
