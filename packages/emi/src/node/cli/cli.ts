import { program } from 'commander'
import pkg from '../../../package.json'
import { dev } from './commands/dev'

export const cli = program

cli.name('emi').description('CLI to emi').version(pkg.version, '-v,--version')

cli.addCommand(dev)

cli.parse()
