/* eslint-disable ts/ban-types */
import type { CommandModule as YargsCommandModule } from 'yargs'
import { loadALocalTemplate } from '../loadALocalTemplate'

interface Args {
  path?: string
}

export const loadTemplateCommand: YargsCommandModule<{}, Args> = {
  command: 'load-template [path]',
  describe: 'load a local template',
  builder: yargs => yargs.option('path', { type: 'string' }),
  handler: ({ path }) => {
    if (!path)
      return
    loadALocalTemplate(path)
  },
}
