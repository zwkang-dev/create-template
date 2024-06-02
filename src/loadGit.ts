import { downloadGitRepo } from './download-git-repo'

function buildGithubLink(repo: string) {
  return `https://github.com/${repo}.git`
}

interface Args {
  repo: string
  removeDotGit?: boolean
}

export async function loadGit(args: Args) {
  const { repo, removeDotGit = true } = args
  const link = buildGithubLink(repo)
  return await downloadGitRepo(link, {
    removeDotGit,
  })
}
