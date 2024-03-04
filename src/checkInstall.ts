import {
  installDependencies,
} from 'nypm'
import ora from 'ora'
import inquirer from 'inquirer'

const schema = [
  {
    type: 'confirm',
    name: 'install',
    message: '是否需要自动安装依赖',
    default: false,
  },
  {
  /** 快捷扩展类型的交互 (请注意key为单个单词，不要使用h保留单词) */
    type: 'list',
    name: 'packageManager',
    message: '请选择对应的包管理器',
    choices: [
      'npm',
      'yarn',
      'pnpm',
    ],
    default: 'pnpm',

    when(result: { install: boolean }) {
      return result.install
    },
  },
]

interface Result {
  install: boolean
  packageManager: 'npm' | 'yarn' | 'pnpm'
}

export async function checkInstall(opts: { dest: string }) {
  const { dest } = opts
  const result = await inquirer.prompt(schema) as Result
  if (result.install) {
    const ins = ora(`下载依赖`).start()
    ins.text = `下载依赖中...`
    await installDependencies({
      cwd: dest,
      silent: true,
      packageManager: result.packageManager,
    })

    ins.succeed('下载依赖成功\n')
    return result
  }
  return result
}
