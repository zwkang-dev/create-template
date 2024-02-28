import path from 'node:path'
import { createWriteStream } from 'node:fs'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import { linkExists } from 'link-exists'
import AdmZip from 'adm-zip'
import { getCacheFolder, getName } from './share'
import { checkExist } from './checkExist'

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

/**
 * download zip file
 * 1. download zip file in temp folder (default: .oneLight_cli)
 * 2. unzip file in template folder
 * 3. remove zip file
 * done
 */
export async function downloadZip(url: string) {
  if (!await linkExists(url))
    console.error('url is not exist')
  const cachePath = getCacheFolder()
  const timeStamp = new Date().getTime()
  const name = getName(url)
  const downloadsPath = path.join(cachePath, 'downloads')
  const zipPath = path.join(cachePath, `temp${timeStamp}.zip`)
  const extractPath = path.join(downloadsPath, name)
  await checkExist(extractPath)
  await fs.ensureDir(downloadsPath)

  // fetch zip file
  await fetch(url).then((response) => {
    response.body?.pipe(createWriteStream(zipPath)).on('close', async () => {
      // unzip file
      const zip = new AdmZip(zipPath)
      await zip.extractAllTo(extractPath, true)

      await fs.move(extractPath, cachePath /** { overwrite: true } */)
      // remove zip file
      await fs.remove(zipPath)
    })
  })

  return cachePath
}
