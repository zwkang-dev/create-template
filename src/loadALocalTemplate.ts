import path from 'node:path'
import process from 'node:process'
import fsExtra from 'fs-extra'
import { logger } from 'rslog'
import colors from 'picocolors'
import { getCacheFolder } from './share'
import { checkExist } from './checkExist'

export async function loadALocalTemplate(folderPath: string) {
  const targetPath = path.join(process.cwd(), folderPath)
  const folderExist = await fsExtra.exists(targetPath)
  if (!folderExist)
    return logger.error(`Folder ${colors.red(targetPath)} not exist`)

  const cacheFolder = getCacheFolder()

  const templateName = path.basename(targetPath)
  const templatePath = path.join(cacheFolder, path.basename(targetPath))

  await checkExist(templatePath)
  if (await fsExtra.pathExists(templatePath))
    return logger.error(`Folder ${templatePath} exist`)

  await fsExtra.copy(targetPath, templatePath)

  logger.info(
    `🚀  Success load local template ${colors.green(templateName)}.`,
  )

  logger.info(
    `    You can use ${colors.green(`zct generator ${templateName} [path]`)} to create a new project.`,
  )
}
