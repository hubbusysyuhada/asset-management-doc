import { createStore } from "vuex";
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import svgResize from "~/helpers/svgResize";
import axios from "axios";

export type Version = {
  version: string;
  iconSystem: Asset[];
  illustrationAsset: Asset[];
  specialCaseIcons: Asset[];
  iconIllustration: Asset[];
}

export type Asset = {
  class: string;
  html: string;
  tag: string;
}

export type RootState = {
  versions: Version[];
  currentVersionIndex: number;
  isInitiated: boolean;
}

const store = createStore<RootState>({
  state: {
    versions: [],
    currentVersionIndex: 0,
    isInitiated: false
  },
  getters: {
    activeVersion(state) {
      return state.versions[state.currentVersionIndex]
    },
    allIcons(state) {
      const icons: Array<Asset & { preview: string }> = []
      state.versions[state.currentVersionIndex].iconSystem.forEach(i => {
        icons.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return icons
    },
    allSpecialIcons(state) {
      const specialIcons: Array<Asset & { preview: string }> = []
      const stored = state.versions[state.currentVersionIndex].specialCaseIcons
      stored.forEach(i => {
        specialIcons.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return specialIcons
    },
    allIllustrations(state) {
      const illustrations: Array<Asset & { preview: string }> = []
      state.versions[state.currentVersionIndex].illustrationAsset.forEach(i => {
        illustrations.push({ ...i, html: svgResize(i.html, '175px'), preview: svgResize(i.html, '100%') })
      })
      return illustrations
    },
    allIconIllustrations(state) {
      const iconIllustrations: Array<Asset & { preview: string }> = []
      const stored = state.versions[state.currentVersionIndex].iconIllustration
      stored.forEach(i => {
        iconIllustrations.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return iconIllustrations
    },
  },
  mutations: {
    changeActiveVersionIndex(state, index: number) {
      state.currentVersionIndex = index
    },
    initiateApp(state, versions: Version[]) {
      state.isInitiated = true
      state.versions = versions.reverse()
    }
  },
  actions: {
    validateVersion(ctx, payload: { version: string; redirect: () => void }) {
      const { version, redirect } = payload
      if (version) {
        const indexOf = ctx.state.versions.map(v => v.version).indexOf(version)
        if (indexOf >= 0) ctx.commit('changeActiveVersionIndex', indexOf)
        else {
          ctx.dispatch('setToLatest')
          redirect()
        }
      }
    },
    setToLatest(ctx) {
      ctx.commit('changeActiveVersionIndex', 0)
    },
    async fetchVersion(ctx) {
      const { data } = await axios.get(useRuntimeConfig().public.BUCKET_URL as string)
      ctx.commit('initiateApp', data)
    }
  }
})


export default defineNuxtPlugin(app => {
  app.vueApp.use(store)
})