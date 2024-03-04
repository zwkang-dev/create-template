import path from 'node:path'
import process from 'node:process'
import fs from 'node:fs/promises'
import { globby } from 'globby'

import fsExtra from 'fs-extra'
import colors from 'picocolors'

import inquirer from 'inquirer'
import { logger } from 'rslog'
import { resolveTemplate } from './share'
import { checkInstall } from './checkInstall'

interface IProps {
  entry: string
  outputDir: string
  emptyDir?: boolean
}

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
const __current = process.cwd()

/**
 * Progress
 *
 *  1. 获取模版代码
 *  2. 提取模块中 replace schema
 *  3. 写入模版代码
 *  4. 生成替换模块
 *  5. 是否需要安装
 *  6. 结束
 *
 */

const zwkangTemplateFile = 'zwkang.template.config.ts'

const defaultConfig: {
  prompt: any[]
  schema: any
  onEnd: any
  name: string
} = {
  prompt: [],
  schema: null,
  onEnd: null,
  name: '',
}

export async function replaceContent(content: string, obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    const regexp = new RegExp(`<%= ${key} %>`, 'g')
    content = content.replace(regexp, obj[key])
  })

  return content
}

export async function createTemplate(props: IProps) {
  logger.greet(`\n🚀  Welcome to use zwkang generator\n`)
  const { entry, outputDir, emptyDir = true } = props
  const entryFolder = await resolveTemplate(entry)
  const entryFiles = await globby(['**/*'], {
    cwd: entryFolder,
    gitignore: true,
    dot: true,
  })
  let configFile = defaultConfig
  const existConfigFile = await fsExtra.exists(path.join(entryFolder, zwkangTemplateFile))
  if (existConfigFile)
    configFile = (await import(path.join(entryFolder, zwkangTemplateFile))).default

  const { prompt = [], schema = null, onEnd } = configFile
  const answer = await inquirer.prompt(prompt)
  if (schema) {
    const validator = schema.safeParse(answer)

    if (!validator.success)
      logger.error(validator.error)
  }

  const outputFolder = path.join(__current, outputDir)
  if (emptyDir)
    await fsExtra.emptyDir(outputFolder)

  await fsExtra.ensureDir(outputFolder)

  logger.info(`🚀  Start creating template ${colors.yellow(entry)}\n`)
  for (const item of entryFiles) {
    const entryFilePath = path.join(entryFolder, item)
    const outputFilePath = path.join(outputFolder, item)
    const isDir = await fs.stat(entryFilePath)
    if (isDir.isDirectory()) {
      await fs.mkdir(outputFilePath)
    }
    else {
      const content = await fs.readFile(entryFilePath, 'utf-8')
      await fsExtra.ensureFile(outputFilePath)
      const compiledContent = await replaceContent(content, answer)
      await fs.writeFile(outputFilePath, compiledContent)
    }
  }

  const { packageManager = 'pnpm' } = await checkInstall({ dest: outputFolder })
  console.log()
  logger.success(`🚀  Successfully created ${colors.green(entry)}\n`)
  logger.success(`Run ${colors.green(`cd ${outputDir} && ${packageManager} && ${packageManager} dev`)} to start development!\n`)
  if (onEnd)
    onEnd?.()
}
