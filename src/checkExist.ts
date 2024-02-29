import inquirer from 'inquirer'
import fsExtra from 'fs-extra'

const schema = [
  {
    type: 'confirm',
    name: 'overwrite',
    message: '是否要覆盖掉现有模版',
    default: true,
  },
]

export async function checkExist(folderPath: string) {
  const res = await fsExtra.exists(folderPath)

  if (!res)
    return
  const { overwrite } = await inquirer.prompt(schema)

  if (overwrite)
    await fsExtra.remove(folderPath)
}
