import type { CommandModule as YargsCommandModule } from 'yargs'
import { downloadZip } from '../download-zip-repo'

interface Args {
  link?: string
}

export const downloadZipCommand: YargsCommandModule<{}, Args> = {
  command: 'download-zip [link]',
  describe: 'download zip file',
  builder: yargs => yargs.option('link', { type: 'string' }),
  handler: ({ link }) => {
    if (!link)
      return
    downloadZip(link)
  },
}
