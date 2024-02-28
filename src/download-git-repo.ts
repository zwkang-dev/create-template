import path from 'node:path'
import simpleGit from 'simple-git'
import fs from 'fs-extra'
import { getCacheFolder, getName } from './share'
import { checkExist } from './checkExist'

export async function downloadGitRepo(
  // git 仓库地址
  link: string,
) {
  const cachePath = getCacheFolder()
  // 模版下载暂存区
  const tempPath = path.join(cachePath, 'downloads')
  console.log(cachePath)
  await fs.ensureDir(tempPath)

  const name = path.basename(getName(link))
  const templatePath = path.join(cachePath, name)

  await checkExist(templatePath)
  return new Promise<string>((resolve, reject) => {
    simpleGit().clone(link, templatePath, {
      '--depth': 1,
    }).then(() => {
      resolve(templatePath)
    }).catch(reject)
  })
}
