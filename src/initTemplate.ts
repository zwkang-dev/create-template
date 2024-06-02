import path from 'node:path'
import fsExtra from 'fs-extra'
import { SETTING_FILE } from './constant'
import { installTemplateDeps } from './installTemplateDeps'
import { getSettingConfig } from './buildConfigFile'

interface IOpts {
  configFile: string
}

export async function initTemplate(opts: IOpts) {
  const { configFile } = opts

  const storagePath = await path.dirname(configFile)
  const nodeModulesExist = await fsExtra.pathExists(path.join(storagePath, 'node_modules'))
  if (!nodeModulesExist) {
    await installTemplateDeps({
      entry: storagePath,
    })
  }
  const config = await getSettingConfig({
    entry: storagePath,
    fileName: SETTING_FILE,
  })

  return config
}
