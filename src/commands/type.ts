import type { CommandModule as YargsCommandModule } from 'yargs'

export type CommandType<T extends Record<string, any>> = YargsCommandModule<{}, T>
