// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   modules: ['@nuxt/image', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/tailwindcss', '@nuxt/icon/module', '@nuxt/fonts'],
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true }
// })


// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/figma-tokens.css'],

  modules: [
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap' }
      ]
    }
  },

  fonts: {
    families: [
      { name: 'Lexend', provider: 'google', global: true }
    ]
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  postcss: {
    plugins: {
      'tailwindcss/nesting': false
    }
  },

  // Khai báo pre-bundle để Vite không cảnh báo reload devtools
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core']
    }
  },

  image: {
    domains: [
      process.env.WP_DOMAIN || 'headless-landing.local',
      'dev-teanis.pantheonsite.io',
      'pantheonsite.io',
      'localhost'
    ],
    format: ['webp', 'avif'],
    quality: 80
  },

  site: {
    url: process.env.SITE_URL || 'https://teanis.com',
    name: 'Teanis Technologies'
  },

  sitemap: {
    sources: [
      '/',
      '/about',
      '/contact'
    ]
  },

  robots: {
    disallow: process.env.NODE_ENV === 'production' ? ['/api/*'] : ['/'],
    sitemap: '/sitemap.xml'
  },

  runtimeConfig: {
    webhookSecret: process.env.WP_WEBHOOK_SECRET,
    wpAppPassword: process.env.WP_APP_PASSWORD,
    wpAppUser: process.env.WP_APP_USER,
    contactReceiveEmail: process.env.CONTACT_RECEIVE_EMAIL || 'trieuncn@teanis.vn',
    wpHeadlessSecret: process.env.WP_HEADLESS_SECRET || '',
    wpDomain: process.env.WP_DOMAIN || 'headless-landing.local',
    wpApiUrl: process.env.WP_API_URL || 'http://headless-landing.local/wp-json',
    wpGraphqlUrl: process.env.WP_GRAPHQL_URL || 'http://headless-landing.local/graphql',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',

    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/': { isr: 3600 },
    '/**': { isr: 3600 },
    '/api/media': { cache: false },
    '/api/**': { cors: false }
  }
})