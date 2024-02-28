import colors from 'picocolors'
import { getAllTemplates } from './share'

export async function listTemplates() {
  const allTemplates = await getAllTemplates()
  allTemplates.forEach((template) => {
    console.log(colors.green(template))
  })
}
