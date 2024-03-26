import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  buildModules: ['@nuxt/typescript-build'],
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  modules: [
    ['@nuxtjs/google-fonts', {
      families: {
        Inter: '200..700',
        'Josefin Slab': {
          wght: '200..900',
          ital: '200..700',
        }
      }
    }],
  ],
  runtimeConfig: {
    public: {
      BUCKET_URL: process.env.BUCKET_URL
    }
  }
}

export default config