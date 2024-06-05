import type { Schema } from 'zod'

import type { Answers, QuestionCollection } from 'inquirer'

export interface IConfig<Result extends Answers = any> {
  name: string

  schema: Pick<Schema, 'safeParse'>

  prompts: (() => QuestionCollection<Result>[]) | QuestionCollection<Result>[]

  onEnd: (args?: {
    dest: string
    template: string
  }) => void | Promise<void>
  onBefore: (args?: {
    dest: string
    template: string
  }) => void | Promise<void>

  afterCustomCommand: string

  customReplace: (
    content: string,
    obj: Result
  ) => Promise<string> | string

  exclude: string[]

  transformAnswer: <T>(answers: Result) => T

  transformFileNames?: (fileName: string, answers: Result) => Promise<string> | string
}

export async function defineConfig<T extends Answers = any>(config: Partial<IConfig<T>>) {
  return config
}
