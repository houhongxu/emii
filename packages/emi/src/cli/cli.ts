import { program } from 'commander'
import json from '../../package.json'
import { dev } from './commands/dev'

export const cli = program

cli.name('emi').description('CLI to emi').version(json.version, '-v,--version')

cli.addCommand(dev)

cli.parse()
