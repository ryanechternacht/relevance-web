// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    'nuxt-lodash',
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxt/ui',
    'nuxt-emoji-picker',
  ],

  dayjs: {
    plugins: [
      'advancedFormat', 
      'calendar',
      'duration', 
      'isSameOrAfter', 
      'relativeTime',
      'utc',
    ]
  },
})