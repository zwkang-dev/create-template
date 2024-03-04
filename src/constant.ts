import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const SCRIPT_NAME = 'zct'

export const DOWNLOAD_FOLDER = '.___downloads___'

export const TEMPORARY_UNZIP_FOLDER = '.__unzip__downloads__'

export const IGNORE_LIST_FOLDER = [DOWNLOAD_FOLDER, TEMPORARY_UNZIP_FOLDER]

export const INTERNAL_TEMPLATE = 'internal-template'

export const filename = fileURLToPath(import.meta.url)
export const dirname = path.dirname(filename)
