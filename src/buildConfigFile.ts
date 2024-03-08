import { createRequire } from 'node:module'
import path, { basename, extname } from 'node:path'
import { build } from 'esbuild'
import { DEFAULT_OUTPUT_FILE, dirname } from './constant'
import type { IConfig } from './defineConfig'

const _require = createRequire(import.meta.url)

interface IOptions {
  entry: string
  fileName: string
}

function getFormat() {
  const ext = extname(DEFAULT_OUTPUT_FILE)
  return ext === '.mjs' ? 'esm' : 'cjs'
}

export async function getBundleContent(opts: IOptions) {
  const { entry, fileName } = opts

  const format = getFormat()
  await build({
    absWorkingDir: entry,
    entryPoints: [fileName],
    outfile: DEFAULT_OUTPUT_FILE,
    write: true,
    target: ['node14.18', 'node16'],
    platform: 'node',
    bundle: true,
    format,
    sourcemap: 'inline',
    metafile: true,
  })

  return path.join(entry, DEFAULT_OUTPUT_FILE)
}

type ISettingOptions = IOptions & {
  homePath?: string
}

async function getConfig(entry: string) {
  const ext = extname(entry)
  if (ext === '.mjs')
    return (await import(entry)).default

  return _require(entry)
}

export async function getSettingConfig(options: ISettingOptions) {
  const file = await getBundleContent(options)
  const fileData = await getConfig(file)
  const value = await fileData
  return value as Partial<IConfig>
}
