import path from 'node:path'
import fsExtra from 'fs-extra'
import { SETTING_FILE } from './constant'
import { installTemplateDeps } from './installTemplateDeps'
import { getSettingConfig } from './buildConfigFile'

interface IOpts {
  entry: string
}

export async function initTemplate(opts: IOpts) {
  const { entry } = opts

  const nodeModulesExist = await fsExtra.pathExists(path.join(entry, 'node_modules'))
  if (!nodeModulesExist) {
    await installTemplateDeps({
      entry,
    })
  }
  const config = await getSettingConfig({
    entry,
    fileName: SETTING_FILE,
  })

  return config
}
