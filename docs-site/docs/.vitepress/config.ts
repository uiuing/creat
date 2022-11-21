import { defineConfig } from 'vitepress'
import ingopGuide from './config/sidebar/Guide'
import nav from './config/nav'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Creat',
  appearance: false,
  description:
    '为思维发散与协同合作孕育而生',
  head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],['script',{},`
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?18839d89d820d8eac2043d14e6209791";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
  `]],
  lastUpdated: true,
  cleanUrls: 'with-subfolders',
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/uiuing/creat' }],
    nav,
    sidebar: {
      '/guide/': ingopGuide,
      '/demo':[]
    }
  }
})
