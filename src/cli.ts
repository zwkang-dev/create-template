import process from 'node:process'
import type { ArgumentsCamelCase } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import updateNotifier from 'update-notifier'
import packageJson from '../package.json'

import { createTemplate } from './createTemplate'
import { downloadGitRepo } from './download-git-repo'
import { downloadZip } from './download-zip-repo'
import { listTemplates } from './listTemplates'
import { SCRIPT_NAME } from './constant'
import { removeTemplate } from './removeTemplate'
import { loadALocalTemplate } from './loadALocalTemplate'

const notifier = updateNotifier({ pkg: packageJson })

const ins = yargs(hideBin(process.argv))
  .scriptName(SCRIPT_NAME)
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', packageJson.version)
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

ins.command(`remove-template [name]`, 'remove template', argv => argv, (argv: ArgumentsCamelCase<{ name: string }>) => {
  removeTemplate(argv.name)
})

ins.command(`load-template [path]`, `load a local template`, argv => argv, (argv: ArgumentsCamelCase<{ path: string }>) => {
  loadALocalTemplate(argv.path)
})

ins.command('download-git [link]', 'download git repo', argv => argv, (argv: ArgumentsCamelCase<{ link: string }>) => {
  downloadGitRepo(argv.link)
})

ins.command('download-zip [link]', 'download zip file', argv => argv, (argv: ArgumentsCamelCase<{ link: string }>) => {
  downloadZip(argv.link)
})

ins.parse()

// Notify using the built-in convenience method
notifier.notify()
