import { defineConfig } from '../../src/defineConfig'

export default defineConfig({
  name: 'ts-lib',
  prompts: [
    {
      type: 'input',
      name: 'user',
      message: 'Please enter the user name',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the project name',
    },
  ],
})
