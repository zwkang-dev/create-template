import path from 'node:path'
import fsExtra from 'fs-extra'
import { logger } from 'rslog'
import colors from 'picocolors'
import { getCacheFolder } from './share'

export async function removeTemplate(templateName: string) {
  const cacheFolder = getCacheFolder()
  const templatePath = path.join(cacheFolder, templateName)
  const exist = await fsExtra.exists(templatePath)
  if (exist)
    await fsExtra.remove(templatePath)

  logger.success(`🎉  Remove template ${colors.green(templateName)} success`)
}
