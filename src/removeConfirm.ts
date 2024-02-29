import path from 'node:path'
import fsExtra from 'fs-extra'
import inquirer from 'inquirer'
import colors from 'picocolors'
import { getName } from './share'

const schema = [
  {
    type: 'confirm',
    name: 'overwrite',
    message: '是否要覆盖掉现有模版',
    default: true,
  },
]
export async function moveConfirm(source: string, dest: string) {
  const name = getName(source)
  const destPath = path.join(dest, name)
  const destExist = await fsExtra.exists(destPath)
  if (!destExist) {
    console.log(colors.green(`模版 ${name} 已经生成`))
    return await fsExtra.move(source, destPath)
  }
  const { overwrite } = await inquirer.prompt(schema)

  if (overwrite) {
    await fsExtra.remove(destPath)
    await fsExtra.move(source, destPath)
  }

  console.log(colors.green(`模版 ${name} 已经覆盖`))
}
