import { installDependencies } from 'nypm'

interface IOpts {
  entry: string
  packageManager?: 'npm' | 'pnpm' | 'yarn'
}

export async function installTemplateDeps(opts: IOpts) {
  const { entry, packageManager = 'pnpm' } = opts
  await installDependencies({
    silent: true,
    cwd: entry,
    packageManager,
  })
}
