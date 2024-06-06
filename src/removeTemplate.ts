import fsExtra from 'fs-extra'
import { logger } from 'rslog'
import colors from 'picocolors'
import { resolveTemplate } from './share'

export async function removeTemplate(templateName: string, internal: boolean = false) {
  const templatePath = await resolveTemplate(templateName, { internal })
  const exist = await fsExtra.exists(templatePath)
  if (exist)
    await fsExtra.remove(templatePath)

  logger.success(`🎉  Remove template ${colors.green(templateName)} success`)
}
