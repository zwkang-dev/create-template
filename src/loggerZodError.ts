import type { ZodError } from 'zod'
import colors from 'picocolors'

export function loggerZodError(error: ZodError) {
  const issues = error.issues
  for (const issue of issues) {
    const { code, message } = issue

    console.log()
    console.log(colors.red(`[Error] ${message}`))
    console.log(colors.gray(`  - code: ${code}`))
    console.log()
    'expected' in issue && issue?.expected && console.log(colors.green(`  - expected: ${issue.expected}`))
    'received' in issue && issue?.received && console.log(colors.red(`  - received: ${issue.received}`))
    console.log()
  }
}
