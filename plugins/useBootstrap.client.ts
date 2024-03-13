import * as bootstrap from 'bootstrap'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(app => {
  app.provide('bootstrap', bootstrap)
})