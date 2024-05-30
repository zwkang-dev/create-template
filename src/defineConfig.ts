import type { Schema } from 'zod'

import type { Answers, QuestionCollection } from 'inquirer'

export interface IConfig<Result extends Answers = any> {
  name: string

  schema: Pick<Schema, 'safeParse'>

  prompts: (() => QuestionCollection<Result>[]) | QuestionCollection<Result>[]

  onEnd: () => void | Promise<void>

  afterCustomCommand: string

  customReplace: (
    content: string,
    obj: Result
  ) => Promise<string> | string
}

export async function defineConfig<T extends Answers = any>(config: Partial<IConfig<T>>) {
  return config
}
