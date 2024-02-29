import path from 'node:path'
import fsExtra from 'fs-extra'
import { name } from '../package.json'
import { homeOrTemp } from './tmpPath'
import { IGNORE_LIST_FOLDER } from './constant'

const mark = /&j&/

export const CACHE_FOLDER_NAME = `.${name}`

export function getCacheFolder() {
  const cachePath = path.join(homeOrTemp, CACHE_FOLDER_NAME)
  fsExtra.ensureDirSync(path.join(homeOrTemp, CACHE_FOLDER_NAME))
  return cachePath
}

export async function getAllTemplates() {
  const cachePath = getCacheFolder()
  const files = await fsExtra.readdir(cachePath)
  const templates = files.filter((file) => {
    const [name, version] = file.split(mark)
    if (IGNORE_LIST_FOLDER.includes(name))
      return false
    return {
      name,
      version,
    }
  })

  return templates
}

export function removeExtname(filePath: string) {
  const extname = path.extname(filePath)
  if (!extname)
    return filePath
  return filePath.replace(new RegExp(`${extname}$`), '')
}

export function getName(link: string) {
  return path.basename(removeExtname(link))
}
