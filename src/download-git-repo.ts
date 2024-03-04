import path from 'node:path'
import simpleGit from 'simple-git'
import fs from 'fs-extra'
import { logger } from 'rslog'
import colors from 'picocolors'
import { getCacheFolder, getName } from './share'
import { checkExist } from './checkExist'
import { DOWNLOAD_FOLDER } from './constant'

interface IOptions {
  aliasName: string
}

export async function downloadGitRepo(
  // git 仓库地址
  link: string,
  options?: IOptions,
) {
  const { aliasName = '' } = (options || {})
  const cachePath = getCacheFolder()
  // 模版下载暂存区
  const tempPath = path.join(cachePath, DOWNLOAD_FOLDER)
  await fs.ensureDir(tempPath)

  const name = path.basename(getName(link))
  const templatePath = aliasName ? path.join(cachePath, aliasName) : path.join(cachePath, name)

  await checkExist(templatePath)
  logger.info(`🚀  Start download template from ${link}`)
  return new Promise<string>((resolve, reject) => {
    simpleGit().clone(link, templatePath, {
      '--depth': 1,
    }).then(() => {
      logger.info(`🎉  Download template ${colors.green(aliasName || name)} success`)
      logger.info(`🚀  Start generator, ${colors.green(`zct generator ${aliasName || name} [output]`)}`)
      resolve(templatePath)
    }).catch(reject)
  })
}
