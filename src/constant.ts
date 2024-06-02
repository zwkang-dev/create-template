import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const SCRIPT_NAME = 'zct'

export const DOWNLOAD_FOLDER = '.___downloads___'

export const TEMPORARY_UNZIP_FOLDER = '.__unzip__downloads__'

export const IGNORE_LIST_FOLDER = [DOWNLOAD_FOLDER, TEMPORARY_UNZIP_FOLDER]

export const INTERNAL_TEMPLATE = 'internal-template'

export const DEFAULT_OUTPUT_FILE = '.out.mjs'

export const filename = fileURLToPath(import.meta.url)
export const dirname = path.dirname(filename)

export const SETTING_FILE = 'zwkang.config.ts'

export const OUTPUT_FILE = '.out.cjs'

export const IGNORE_FILES = [SETTING_FILE, OUTPUT_FILE]

export const IGNORE_GLOB = ['node_modules', '.git']
