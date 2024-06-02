import { loadGit } from '../loadGit'
import type { CommandType } from './type'

interface Args {
  repo?: string
  removeDotGit?: boolean
}

export const loadGitCommand: CommandType<Args> = {
  command: 'load-git <repo>',
  describe: 'load git repo',
  builder: yargs => yargs.positional('repo', { type: 'string' }).option('removeDotGit', { type: 'boolean', alias: 'remove-dot-git' }),
  handler: async ({ repo, removeDotGit }) => {
    console.log(removeDotGit)
    if (!repo)
      return
    await loadGit({
      repo,
      removeDotGit,
    })
  },
}
