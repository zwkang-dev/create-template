import colors from 'picocolors'
import { logger } from 'rslog'
import { getAllTemplates } from './share'

export async function listTemplates() {
  const allTemplates = await getAllTemplates()
  allTemplates.forEach((template) => {
    logger.info(`${colors.cyan(colors.bold('模板'))}: ${colors.green(template)}`)
  })
}
