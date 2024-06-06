import type { CommandModule as YargsCommandModule } from 'yargs'
import { removeTemplate } from '../removeTemplate'

interface Args {
  name?: string
  internal?: boolean
}

export const removeTemplateCommand: YargsCommandModule<{}, Args> = {
  command: 'remove-template [name]',
  describe: 'remove template',
  builder: yargs => yargs.option('name', { type: 'string' }).option('internal', { type: 'boolean', default: false }),
  handler: ({ name, internal }) => {
    if (!name)
      return
    removeTemplate(name, internal)
  },
}
