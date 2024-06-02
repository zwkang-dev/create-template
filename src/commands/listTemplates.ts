import type { CommandModule as YargsCommandModule } from 'yargs'
import { listTemplates } from '../listTemplates'

interface Args {
}

export const listTemplatesCommand: YargsCommandModule<{}, Args> = {
  command: 'list-templates [path]',
  describe: 'list templates',
  builder: args => args,
  handler: () => {
    listTemplates()
  },
}
