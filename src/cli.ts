import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import updateNotifier from 'update-notifier'
import packageJson from '../package.json'

import { SCRIPT_NAME } from './constant'

import {
  downloadGitCommand,
  downloadZipCommand,
  generatorCommand,
  listTemplatesCommand,
  loadGitCommand,
  loadTemplateCommand,
  removeTemplateCommand,
} from './commands'

const notifier = updateNotifier({ pkg: packageJson })

const ins = yargs(hideBin(process.argv))
  .scriptName(SCRIPT_NAME)
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', packageJson.version)
  .alias('v', 'version')

ins
  .command(loadTemplateCommand)
  .command(downloadGitCommand)
  .command(downloadZipCommand)
  .command(generatorCommand)
  .command(listTemplatesCommand)
  .command(removeTemplateCommand)
  .command(loadGitCommand)
  .parse()

// Notify using the built-in convenience method
notifier.notify()
