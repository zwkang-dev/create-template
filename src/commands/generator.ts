/* eslint-disable ts/ban-types */
import type { CommandModule as YargsCommandModule } from 'yargs'
import { createTemplate } from '../createTemplate'

interface Args {
  output: string
  entry: string
}

export const generatorCommand: YargsCommandModule<{}, Args> = {
  command: 'generator [entry] [output]',
  describe: 'generator template',
  builder: args => args.option('output', { type: 'string', default: '' }).option('entry', { type: 'string', default: '' }),
  handler: async ({ output, entry }) => {
    return await createTemplate({
      entry,
      outputDir: output,
      emptyDir: true,
    })
  },
}
