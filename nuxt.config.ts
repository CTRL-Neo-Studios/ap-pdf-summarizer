// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-12-30',
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],

    modules: [
      '@nuxt/ui',
      '@nuxt/image',
      '@nuxt/scripts',
      '@nuxt/test-utils',
      'nuxt-auth-utils',
      'nuxt-umami',
      '@nuxt/icon',
      '@nuxt/fonts',
      'nuxt-authorization',
      '@nuxthub/core',
      '@vueuse/nuxt',
      '@pinia/nuxt'
    ],

    hub: {
        db: 'postgresql',
        blob: {
            driver: 'vercel-blob'
        }
    },

    runtimeConfig: {
        openrouter: {
            apiKey: '',
            modelId: ''
        }
    },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        layoutTransition: { name: 'layout', mode: 'out-in' },
    },
})