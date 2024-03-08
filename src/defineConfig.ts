import type { Schema } from 'zod'

import type { QuestionCollection } from 'inquirer'

export interface IConfig {
  name: string

  schema: Pick<Schema, 'safeParse'>

  prompts: (() => QuestionCollection[]) | QuestionCollection[]

  onEnd: () => void | Promise<void>

  afterCustomCommand: string
}

export async function defineConfig(config: Partial<IConfig>) {
  return config
}
