import { createStore } from "vuex";
import { defineNuxtPlugin } from 'nuxt/app'
import changelogs from "~/changelog";
import svgResize from "~/helpers/svgResize";

export type Version = {
  version: string;
  icons: Asset[];
  illustrations: Asset[];
  specialIcons: Asset[];
  iconIllustrations: Asset[];
}

export type Asset = {
  class: string;
  html: string;
  tag: string;
}

export type RootState = {
  versions: Version[];
  currentVersionIndex: number;
}

const store = createStore<RootState>({
  state: {
    versions: changelogs.reverse(),
    currentVersionIndex: 0
  },
  getters: {
    activeVersion(state) {
      return state.versions[state.currentVersionIndex]
    },
    allIcons(state) {
      const icons: Array<Asset & { preview: string }> = []
      state.versions[state.currentVersionIndex].icons.forEach(i => {
        icons.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return icons
    },
    allSpecialIcons(state) {
      const specialIcons: Array<Asset & { preview: string }> = []
      const stored = state.versions[state.currentVersionIndex].specialIcons || []
      stored.forEach(i => {
        specialIcons.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return specialIcons
    },
    allIllustrations(state) {
      const illustrations: Array<Asset & { preview: string }> = []
      state.versions[state.currentVersionIndex].illustrations.forEach(i => {
        illustrations.push({ ...i, html: svgResize(i.html, '175px'), preview: svgResize(i.html, '100%') })
      })
      return illustrations
    },
    allIconIllustrations(state) {
      const iconIllustrations: Array<Asset & { preview: string }> = []
      const stored = state.versions[state.currentVersionIndex].iconIllustrations || []
      stored.forEach(i => {
        iconIllustrations.push({ ...i, html: svgResize(i.html, '60px'), preview: svgResize(i.html, '50%') })
      })
      return iconIllustrations
    },
  },
  mutations: {
    changeActiveVersionIndex(state, index: number) {
      state.currentVersionIndex = index
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
    }
  }
})


export default defineNuxtPlugin(app => {
  app.vueApp.use(store)
})