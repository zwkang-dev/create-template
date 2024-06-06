import type { Schema } from 'zod'

import type { Answers, QuestionCollection } from 'inquirer'

import type { Colors } from 'picocolors/types'

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

  successLogs?: (colors: Colors, opts: Result & { pkgManager: string, dest: string }) => string[]

  // easy to set some field to package.json
  pkg?: (args: Result) => Record<string, any>
}

export async function defineConfig<T extends Answers = any>(config: Partial<IConfig<T>>) {
  return config
}
