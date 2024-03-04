import path from 'node:path'
import fsExtra from 'fs-extra'
import { name } from '../package.json'
import { homeOrTemp } from './tmpPath'
import { IGNORE_LIST_FOLDER, dirname } from './constant'

const mark = /&j&/

export const CACHE_FOLDER_NAME = `.${name}`

export function getCacheFolder() {
  const cachePath = path.join(homeOrTemp, CACHE_FOLDER_NAME)
  fsExtra.ensureDirSync(path.join(homeOrTemp, CACHE_FOLDER_NAME))
  return cachePath
}

export function getInternalTemplatePath() {
  return path.join(dirname, '../internal-templates')
}

export async function resolveTemplate(templateName: string) {
  const cacheFolder = getCacheFolder()
  const internalFolder = getInternalTemplatePath()
  // 优先取用户自定义模版
  const cacheTemplate = path.join(cacheFolder, templateName)
  const templateExist = await fsExtra.exists(cacheTemplate)
  if (templateExist)
    return cacheTemplate
  return internalFolder
}

export async function getFolders(folderPath: string) {
  const folders = await fsExtra.readdir(folderPath)
  const templates = folders?.filter((folders) => {
    const [name, version] = folders.split(mark)
    if (IGNORE_LIST_FOLDER.includes(name))
      return false
    return {
      name,
      version,
    }
  })

  return templates ?? []
}

export async function getInternalTemplateFolder() {
  const templateFolder = path.join(dirname, '../internal-templates')
  return await getFolders(templateFolder)
}

export async function getAllTemplates() {
  const cachePath = getCacheFolder()
  return await getFolders(cachePath)
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
