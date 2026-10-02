// https://nuxt.com/docs/api/configuration/nuxt-config

// Runs before paint so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem('pulse-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

// `npm run build` runs `nuxt generate`: a fully static site in .output/public (no server needed).
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Pulse is a sales analytics dashboard template: revenue, orders, customers and settings, with light and dark themes.' },
        { name: 'robots', content: 'noindex' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
      script: [{ innerHTML: themeScript, tagPosition: 'head' }],
    },
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/orders/', '/customers/', '/settings/'] } },
  router: { options: { strict: false } },
})
