import path from 'node:path'
import simpleGit from 'simple-git'
import fs from 'fs-extra'
import { logger } from 'rslog'
import colors from 'picocolors'
import { getCacheFolder, getName } from './share'
import { checkExist } from './checkExist'
import { DOWNLOAD_FOLDER } from './constant'

interface IOptions {
  aliasName?: string
  removeDotGit?: boolean
}

export async function downloadGitRepo(
  // git 仓库地址
  link: string,
  options?: IOptions,
) {
  const { aliasName = '', removeDotGit = true } = (options || {})
  const cachePath = getCacheFolder()
  // 模版下载暂存区
  const tempPath = path.join(cachePath, DOWNLOAD_FOLDER)
  await fs.ensureDir(tempPath)

  const name = path.basename(getName(link))
  const templatePath = aliasName ? path.join(cachePath, aliasName) : path.join(cachePath, name)

  const res = await checkExist(templatePath)
  if (res) {
    logger.info(`🚀  Start generator, ${colors.green(`zct generator ${aliasName || name} [output]`)}`)
    return templatePath
  }
  logger.info(`🚀  Start download template from ${link}`)
  return new Promise<string>((resolve, reject) => {
    simpleGit().clone(link, templatePath, {
      '--depth': 1,
    }).then(async () => {
      if (removeDotGit) {
        // delete .git folder
        await fs.remove(`${templatePath}/.git`)
      }
      logger.info(`🎉  Download template ${colors.green(aliasName || name)} success`)
      logger.info(`🚀  Start generator, ${colors.green(`zct generator ${aliasName || name} [output]`)}`)
      resolve(templatePath)
    }).catch(reject)
  })
}
