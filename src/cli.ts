import process from 'node:process'
import type { ArgumentsCamelCase } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { name, version } from '../package.json'

import { createTemplate } from './createTemplate'
import { downloadGitRepo } from './download-git-repo'
import { downloadZip } from './download-zip-repo'
import { listTemplates } from './listTemplates'

const ins = yargs(hideBin(process.argv))
  .scriptName(name)
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')

ins.command('generator [entry] [output]', 'generator template', argv => argv, (argv: ArgumentsCamelCase<{
  entry: string
  output: string
}>) => {
  return createTemplate({
    entry: argv.entry,
    outputDir: argv.output,
    emptyDir: true,
  })
})

ins.command('list-template', 'list all template', argv => argv, () => {
  listTemplates()
})

ins.command('download-git [link]', 'download git repo', argv => argv, (argv: ArgumentsCamelCase<{ link: string }>) => {
  downloadGitRepo(argv.link)
})

ins.command('download-zip [link]', 'download zip file', argv => argv, (argv: ArgumentsCamelCase<{ link: string }>) => {
  downloadZip(argv.link)
})

ins.parse()
