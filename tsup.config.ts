import type { Options } from 'tsup'

const config: Options = {
  splitting: true,
  format: ['esm'],
  entryPoints: ['src/cli.ts'],
  clean: true,
  dts: true,
  outDir: './dist',
}

export default config
