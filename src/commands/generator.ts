import type { CommandModule as YargsCommandModule } from 'yargs'
import { createTemplate } from '../createTemplate'

interface Args {
  output: string
  entry: string
  internal: boolean
}

export const generatorCommand: YargsCommandModule<{}, Args> = {
  command: 'generator [entry] [output]',
  describe: 'generator template',
  builder: args => args.option('output', { type: 'string', default: '' }).option('entry', { type: 'string', default: '' }).option(
    'internal',
    {
      type: 'boolean',
      default: false,
    },
  ),
  handler: async ({ output, entry, internal }) => {
    return await createTemplate({
      entry,
      outputDir: output,
      emptyDir: true,
      internal,
    })
  },
}
