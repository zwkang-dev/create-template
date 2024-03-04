import colors from 'picocolors'
import { logger } from 'rslog'
import { getAllTemplates, getInternalTemplateFolder } from './share'
import { dirname } from './constant'

export async function listTemplates() {
  console.log(dirname)
  const allTemplates = await getAllTemplates()
  const internalTemplates = await getInternalTemplateFolder()

  logger.info(`${colors.bold('内置模板')}`)

  if (!internalTemplates.length) {
    logger.info(`   ${colors.gray('暂无内置模板')}`)
  }
  else {
    internalTemplates.forEach((template) => {
      logger.info(`   ${colors.cyan(colors.bold('模板'))}: ${colors.green(template)}`)
    })
  }

  logger.info(`${colors.bold('自定义模板')}`)
  if (!allTemplates.length) {
    logger.info(`   ${colors.gray('暂无自定义模板')}`)
  }
  else {
    allTemplates.forEach((template) => {
      logger.info(`   ${colors.cyan(colors.bold('模板'))}: ${colors.green(template)}`)
    })
  }
}
