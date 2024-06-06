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
import { IGNORE_FILES, IGNORE_GLOB } from './constant'
import { get, set } from './answerCache'
import { resolveConfigFile, travelPromptTreeAppendResult } from './util'
import { createFilter } from './createFilter'

interface IProps {
  entry: string
  outputDir: string
  emptyDest?: boolean
  internal?: boolean
  ignoreInstall?: boolean
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
 * - ._template_config
 *   - delta.config.ts
 * - README.md
 * - package.json
 *
 */

function noop() {}

function justReturn(args: any) {
  return args
}

const defaultConfig: Partial<IConfig> = {
  prompts: [],
  schema: undefined,
  onEnd: noop,
  onBefore: noop,
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

/**
 * create generator template
 * @param props
 * @returns
 */
export async function createTemplate(props: IProps) {
  logger.greet(`\n🚀  Welcome to use zwkang generator\n`)
  const { entry, outputDir, emptyDest = true, internal = false, ignoreInstall = false } = props

  // to make sure template entry
  const entryFolder = await resolveTemplate(entry, { internal })
  const entryFiles = await globby(['**/*'], {
    cwd: entryFolder,
    gitignore: true,
    dot: true,
  })

  // to locate config file
  let configFile = defaultConfig
  const configFilePath = await resolveConfigFile(entryFolder)
  if (configFilePath !== null)
    configFile = await initTemplate({ configFile: configFilePath })

  // to filter ignore resolve template file
  const filters = createFilter([...IGNORE_GLOB, ...configFile.exclude || []])
  const filterEntryFiles = entryFiles.filter(filters)
  const { prompts = [], schema = null, onEnd, customReplace, name, transformAnswer = justReturn, transformFileNames = justReturn, successLogs, pkg = noop } = configFile

  // try to cache user prompt answers
  const cacheAnswer = get<Record<string, any>>(name!) || {}
  let answer = await inquirer.prompt(
    travelPromptTreeAppendResult(handleFnOrValue(prompts), cacheAnswer),
  )
  set(name!, answer)

  // if schema is not null, to validate answer
  if (schema) {
    const validator = schema.safeParse(answer)

    if (!validator.success) {
      loggerZodError(validator.error)
      return
    }
  }

  answer = transformAnswer(answer)

  // to locate output folder
  const outputFolder = path.join(__current, outputDir)
  if (emptyDest)
    await fsExtra.emptyDir(outputFolder)

  await fsExtra.ensureDir(outputFolder)

  logger.info(`🚀  Start creating template ${colors.yellow(entry)}\n`)
  for (const item of filterEntryFiles) {
    if (IGNORE_FILES.includes(basename(item)))
      continue

    const entryFilePath = path.join(entryFolder, item)
    const transformedItemName = await transformFileNames(item, answer)
    const outputFilePath = path.join(outputFolder, transformedItemName)
    const isDir = await fs.stat(entryFilePath)
    // support transform file name using answer data
    if (isDir.isDirectory()) {
      await fs.mkdir(outputFilePath)
    }
    else {
      const content = await fs.readFile(entryFilePath, 'utf-8')
      await fsExtra.ensureFile(outputFilePath)
      // support custom transform for file content
      const compiledContent = customReplace ? await customReplace(content, answer) : await replaceContent(content, answer)
      if (item.endsWith('package.json')) {
        const pkgReplaceResult = pkg(answer)
        if (pkgReplaceResult) {
          const pkgData = JSON.parse(
            await fs.readFile(path.join(compiledContent, `package.json`), 'utf-8'),
          )

          const content = JSON.stringify({
            ...pkgData,
            ...pkgReplaceResult,
          }, null, 2)

          await fs.writeFile(outputFilePath, `${content}\n`)
        }
      }

      // write to target path
      await fs.writeFile(outputFilePath, compiledContent)
    }
  }

  const { packageManager = 'pnpm' } = await checkInstall({ dest: outputFolder, ignore: ignoreInstall })
  console.log()
  if (successLogs) {
    successLogs(colors, {
      ...answer,
      dest: outputDir,
      pkgManager: packageManager,
    }).map(logger.success)
  }
  else {
    logger.success(`🚀  Successfully created ${colors.green(entry)}\n`)
    logger.success(`Run ${colors.green(`cd ${outputDir} && ${packageManager} && ${packageManager} dev`)} to start development!\n`)
  }
  if (onEnd)
    onEnd?.()
}
