import { defineConfig } from 'vitepress'
import sidebar from './config/sidebarD'
import nav from './config/navD'

export default defineConfig({
  lang: 'zh-CN',
  title: 'creat - docs',
  // TODO: description
  description:'',
  head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],
  lastUpdated: true,
  cleanUrls: 'with-subfolders',
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/uiuing/ingop' }],
    editLink: {
      pattern: 'https://github.com/uiuing/ingop/edit/main/site/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav,
    sidebar
  }
})
