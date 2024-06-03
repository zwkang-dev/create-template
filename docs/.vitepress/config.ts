import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'how to use create-template ',
  description: 'A simple docs for create-template',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Usage', link: '/usage-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Usage Examples', link: '/usage-examples' },
          { text: 'Template Setting', link: '/template-config-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zwkang-dev/create-template' },
    ],
  },
})
