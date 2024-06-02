/* eslint-disable ts/ban-types */
import type { CommandModule as YargsCommandModule } from 'yargs'
import { removeTemplate } from '../removeTemplate'

interface Args {
  name?: string
}

export const removeTemplateCommand: YargsCommandModule<{}, Args> = {
  command: 'remove-template [name]',
  describe: 'remove template',
  builder: yargs => yargs.option('name', { type: 'string' }),
  handler: ({ name }) => {
    if (!name)
      return
    removeTemplate(name)
  },
}
