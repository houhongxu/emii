import { program } from 'commander'
import json from '../package.json'

program
  .name('emi')
  .description('CLI to emi')
  .version(json.version, '-v,--version')

program
  .command('dev')
  .argument('<string>', 'dev it', 'nothing')
  .option('-l,--log <char>', 'log it')
  .action((argument, options) => {
    console.log(argument, options)
  })

program.parse()
