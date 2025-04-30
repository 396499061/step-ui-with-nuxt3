// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['vuetify/styles','@/assets/css/main.scss'], // 确保全局样式加载
  build: {
    transpile: ['vuetify'], // 确保 Vuetify 组件正确编译
  },
  vite: {
    define: {
      'process.env.DEBUG': false, // 解决可能的 Vite 解析问题
    },
  },
})
