/* eslint-disable ts/ban-types */
import type { CommandModule as YargsCommandModule } from 'yargs'
import { listTemplates } from '../listTemplates'

interface Args {
}

export const listTemplateCommand: YargsCommandModule<{}, Args> = {
  command: 'load-template [path]',
  describe: 'load a local template',
  builder: args => args,
  handler: () => {
    listTemplates()
  },
}
