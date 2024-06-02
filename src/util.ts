import path from 'node:path'
import type { QuestionCollection } from 'inquirer'
import fsExtra from 'fs-extra'
import { SETTING_FILE } from './constant'

export function travelPromptTreeAppendResult<T extends QuestionCollection>(prompts: T[], answer: Record<string, any>) {
  for (const prompt of prompts) {
    if ('name' in prompt && prompt.name && typeof prompt.name === 'string' && typeof prompt.default !== 'undefined')
      prompt.default = answer[prompt.name]
  }

  return prompts
}

export async function resolveConfigFile(templateFolder: string) {
  // return path.join(templateFolder, SETTING_FILE)
  // return path.join
  const path1 = path.join(templateFolder, SETTING_FILE)

  if (await fsExtra.exists(path1))
    return path1

  const path2 = path.join(templateFolder, '._template_config', SETTING_FILE)
  if (await fsExtra.exists(path2))
    return path2

  return null
}
