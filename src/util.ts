import type { QuestionCollection } from 'inquirer'

export function travelPromptTreeAppendResult<T extends QuestionCollection>(prompts: T[], answer: Record<string, any>) {
  for (const prompt of prompts) {
    if ('name' in prompt && prompt.name && typeof prompt.name === 'string' && typeof prompt.default !== 'undefined')
      prompt.default = answer[prompt.name]
  }

  return prompts
}
