# Template Config

Template support using config file to customize template resolve.


## Config File

- `zwkang.config.ts`

> put your zwkang.config.ts file in the root of your template project

> or put your zwkang.config.ts file in the root of your ._template_config folder

````typescript
import { defineConfig } from 'create-template';
import { z } from 'zod';

export default defineConfig({
  // template name
  name: 'zwkang'

  // custom prompts when generator components ask for user input
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Project name',
      default: 'my-project'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'A simple project'
    }
  ],

  // support custom schema for validate user input
  schema: z.object({
    name: z.string(),
    description: z.string()
  }),

  // custom template replacement function
  // - options for user input
  customReplace: (template, options) => {
    return template
      .replace(/{{name}}/g, options.name)
      .replace(/{{description}}/g, options.description)
  }

  // exclude support glob for ignore template generator files
  exclude: ['**/node_modules/**', '**/dist/**']
})
````

