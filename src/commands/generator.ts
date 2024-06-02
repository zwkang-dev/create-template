import type { CommandModule as YargsCommandModule } from 'yargs'
import { createTemplate } from '../createTemplate'

interface Args {
  output: string
  entry: string
  internal: boolean
  emptyDest: boolean
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
  ).option('emptyDest', { type: 'boolean', default: true, alias: 'empty-dest' }),
  handler: async ({ output, entry, internal, emptyDest }) => {
    return await createTemplate({
      entry,
      outputDir: output,
      emptyDest,
      internal,
    })
  },
}
