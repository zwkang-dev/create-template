import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import fs from 'node:fs/promises'
import { globby } from 'globby'

import fsExtra from 'fs-extra'
import { template } from 'lodash-es'
import ora from 'ora'

import inquirer from 'inquirer'
import { getCacheFolder } from './share'

interface IProps {
  entry: string
  outputDir: string
  emptyDir?: boolean
}

const progress = ora('Creating template...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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

export async function createTemplate(props: IProps) {
  const ins = progress.start()
  const { entry, outputDir, emptyDir = true } = props
  const cachePath = getCacheFolder()
  const entryFolder = path.join(cachePath, entry)
  const entryFiles = await globby(['**/*'], {
    cwd: entryFolder,
    gitignore: true,
  })
  let configFile = defaultConfig
  const existConfigFile = await fsExtra.exists(path.join(entryFolder, zwkangTemplateFile))
  if (existConfigFile)
    configFile = (await import(path.join(entryFolder, zwkangTemplateFile))).default

  const { prompt = [], schema = null, onEnd, name = '' } = configFile
  const answer = await inquirer.prompt(prompt)
  if (schema) {
    const validator = schema.safeParse(answer)

    if (!validator.success)
      console.error(validator.error)
  }

  const outputFolder = path.join(__current, outputDir)
  if (emptyDir)
    await fsExtra.emptyDir(outputFolder)

  await fsExtra.ensureDir(outputFolder)

  let idx = 0

  for (const item of entryFiles) {
    idx += 1
    const present = ((idx / entryFiles.length) * 100).toFixed(0)
    const entryFilePath = path.join(entryFolder, item)
    const outputFilePath = path.join(outputFolder, item)
    const isDir = await fs.stat(entryFilePath)
    if (isDir.isDirectory()) {
      await fs.mkdir(outputFilePath)
    }
    else {
      const content = await fs.readFile(entryFilePath, 'utf-8')
      const compiled = template(content)
      const compiledContent = compiled(answer)
      ins.text = `${present}% writing ${outputFilePath}`
      await fsExtra.ensureFile(outputFilePath)
      await fs.writeFile(outputFilePath, compiledContent)
    }
  }

  ins.succeed(`thanks using template ${name}`)
  if (onEnd)
    onEnd?.()

  ins.stop()
}
