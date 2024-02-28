import { homedir, tmpdir } from 'node:os'

export const homeOrTemp = homedir() || tmpdir()
