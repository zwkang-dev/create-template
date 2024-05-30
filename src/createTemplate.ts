import path, { basename } from 'node:path'
import process from 'node:process'
import fs from 'node:fs/promises'
import { globby } from 'globby'

import fsExtra from 'fs-extra'
import colors from 'picocolors'

import inquirer from 'inquirer'
import { logger } from 'rslog'
import { resolveTemplate } from './share'
import { checkInstall } from './checkInstall'
import { initTemplate } from './initTemplate'
import type { IConfig } from './defineConfig'
import { loggerZodError } from './loggerZodError'
import { IGNORE_FILES } from './constant'
import { get, set } from './answerCache'
import { travelPromptTreeAppendResult } from './util'

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

/**
 * template struct
 *
 * 模版的结构
 *
 * - template
 * - zwkang.template.config.ts
 * - README.md
 * - package.json
 *
 */

const zwkangTemplateFile = 'zwkang.config.ts'

const defaultConfig: Partial<IConfig> = {
  prompts: [],
  schema: undefined,
  onEnd: undefined,
  name: undefined,
}

export async function replaceContent(content: string, obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    const regexp = new RegExp(`<%= ${key} %>`, 'g')
    content = content.replace(regexp, obj[key])
  })

  return content
}

function handleFnOrValue<T>(cb: T) {
  if (typeof cb === 'function')
    return cb()

  return cb
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
    configFile = await initTemplate({ entry: path.join(entryFolder) })

  const { prompts = [], schema = null, onEnd, customReplace, name } = configFile
  const cacheAnswer = get<Record<string, any>>(name!) || {}
  const answer = await inquirer.prompt(
    travelPromptTreeAppendResult(handleFnOrValue(prompts), cacheAnswer),
  )
  set(name!, answer)
  if (schema) {
    const validator = schema.safeParse(answer)

    if (!validator.success) {
      loggerZodError(validator.error)
      return
    }
  }

  const outputFolder = path.join(__current, outputDir)
  if (emptyDir)
    await fsExtra.emptyDir(outputFolder)

  await fsExtra.ensureDir(outputFolder)

  logger.info(`🚀  Start creating template ${colors.yellow(entry)}\n`)
  for (const item of entryFiles) {
    if (IGNORE_FILES.includes(basename(item)))
      continue

    const entryFilePath = path.join(entryFolder, item)
    const outputFilePath = path.join(outputFolder, item)
    const isDir = await fs.stat(entryFilePath)
    if (isDir.isDirectory()) {
      await fs.mkdir(outputFilePath)
    }
    else {
      const content = await fs.readFile(entryFilePath, 'utf-8')
      await fsExtra.ensureFile(outputFilePath)
      const compiledContent = customReplace ? await customReplace(content, answer) : await replaceContent(content, answer)
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
