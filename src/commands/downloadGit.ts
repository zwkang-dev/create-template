import type { CommandModule as YargsCommandModule } from 'yargs'
import { downloadGitRepo } from '../download-git-repo'

interface Args {
  link?: string
}

export const downloadGitCommand: YargsCommandModule<{}, Args> = {
  command: 'download-git [link]',
  describe: 'download git repo',
  builder: yargs => yargs.option('link', { type: 'string' }),
  handler: ({ link }) => {
    if (!link)
      return
    downloadGitRepo(link)
  },
}
