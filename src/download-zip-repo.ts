import path from 'node:path'
import { createWriteStream } from 'node:fs'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import { linkExists } from 'link-exists'
import AdmZip from 'adm-zip'
import { logger } from 'rslog'
import colors from 'picocolors'
import { getCacheFolder, getName } from './share'
import { DOWNLOAD_FOLDER, TEMPORARY_UNZIP_FOLDER } from './constant'
import { moveConfirm } from './removeConfirm'

export interface FileStat {
  name: string
  isDirectory: boolean
  isFile: boolean
}

export function readDirWithFileTypes(folder: string): FileStat[] {
  const list = fs.readdirSync(folder)
  const res = list.map((name: string) => {
    const stat = fs.statSync(path.join(folder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
    }
  })
  return res
}

interface IOptions {
  aliasName?: string
  extractDeep?: boolean
}

/**
 * download zip file
 * 1. download zip file in temp folder (default: .oneLight_cli)
 * 2. unzip file in template folder
 * 3. remove zip file
 * done
 */
export async function downloadZip(url: string, options: IOptions = {}) {
  if (!await linkExists(url))
    console.error('url is not exist')
  const { aliasName } = options
  const cachePath = getCacheFolder()
  const timeStamp = new Date().getTime()
  const name = getName(url)
  const downloadsPath = path.join(cachePath, DOWNLOAD_FOLDER)
  const templateUnzipPath = aliasName ? path.join(cachePath, TEMPORARY_UNZIP_FOLDER, aliasName) : path.join(cachePath, TEMPORARY_UNZIP_FOLDER, name)
  const zipPath = path.join(downloadsPath, `temp${timeStamp}.zip`)
  await fs.ensureDir(downloadsPath)
  await fs.ensureDir(templateUnzipPath)
  logger.info(`🚀  Start download template from ${url}`)
  // fetch zip file
  await fetch(url).then((response) => {
    response.body?.pipe(createWriteStream(zipPath)).on('close', async () => {
      // unzip file
      const zip = new AdmZip(zipPath)
      await zip.extractAllTo(templateUnzipPath, true)
      logger.info(`🎉  Download template ${aliasName || name} success`)
      logger.info(`🚀  Start generator, ${colors.green(`zct generator ${aliasName || name} [output]`)}`)
      await moveConfirm(templateUnzipPath, cachePath)
      // // // remove zip file
      await fs.remove(zipPath)
      await fs.remove(templateUnzipPath)
    })
  })

  return cachePath
}
