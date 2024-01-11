import { program } from 'commander'
import { dev } from './commands/dev'

export const cli = program

cli
  .name('emi')
  .description('CLI to emi')
  .version(require('../../../package.json').version, '-v,--version')

cli.addCommand(dev)

cli.parse()
