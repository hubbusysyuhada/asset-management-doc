<template>
  <div class="d-flex flex-column align-items-center" v-if="isReady">
    <div id="search-bar">
      <input type="text" class="form-control" placeholder="search keywords" v-model="keywords">
      <h4>Showing {{ filtered.length }} results</h4>
    </div>
    <div class="card-container">
      <div :class="`card${assetType === 'illustrations' ? ' lg' : ''}`" v-for="asset in filtered" :key="asset.class" @click="clickAsset(asset.class)">
        <div v-html="asset.html" class="preview"></div>
        <div class="class-name">
          <p>{{ parseDisplayTagName(asset.tag) }}</p>
        </div>
      </div>
    </div>

    <Modal :is-open="openModal">
      <div class="content">
        <div class="asset-modal-preview">
          <div v-html="getAsset($route.query.class as string)?.preview"></div>
        </div>
        <div class="asset-modal-description">
          <div class="syntax-box">
            <div class="language-selector">
              <div :class="`language ${selectedLanguage === 'html' ? 'active' : ''}`" @click="changeLanguage('html')">
                <p>HTML</p>
              </div>
              <div :class="`language ${selectedLanguage === 'vue' ? 'active' : ''}`" @click="changeLanguage('vue')">
                <p>VUE</p>
              </div>
            </div>
            <div class="code" v-if="selectedLanguage === 'html'">
              <p class="commented-lines">&lt;!-- default usage --&gt;</p>
              <div class="syntax-container">
                <p class="syntax" @click="copyToClipboard(false)">{{ syntax.html }}</p>
                <div class="copy-tooltip"><p ref="copy-text">copy to clipboard</p></div>
              </div>
              <br>
              <p class="commented-lines">&lt;!-- you could also pass the "size"{{assetType === 'icons' ? ' and "color"' : ''}} attribute to customize the asset --&gt;</p>
              <div class="syntax-container">
                <p class="syntax" @click="copyToClipboard(true)">
                  {{ syntax.htmlCustomize }}
                </p>
                <div class="copy-tooltip"><p ref="copy-text-custom">copy to clipboard</p></div>
              </div>
            </div>
            <div class="code" v-else>
              <p class="commented-lines">&lt;!-- import in script --&gt;</p>
              <div class="syntax-container">
                <p class="syntax" @click="copyToClipboard(false, true)">{{ syntax.vueScript }}</p>
                <div class="copy-tooltip"><p ref="copy-text-script">copy to clipboard</p></div>
              </div>
              <br>
              <p class="commented-lines">&lt;!-- default in template --&gt;</p>
              <div class="syntax-container">
                <p class="syntax" @click="copyToClipboard(false)">{{ syntax.vueTemplate }}</p>
                <div class="copy-tooltip"><p ref="copy-text">copy to clipboard</p></div>
              </div>
              <br>
              <p class="commented-lines">&lt;!-- you could also pass the "size"{{assetType === 'icons' ? ' and "color"' : ''}} attribute to customize the asset --&gt;</p>
              <div class="syntax-container">
                <p class="syntax" @click="copyToClipboard(true)">
                  {{ syntax.vueTemplateCustomize }}
                </p>
                <div class="copy-tooltip"><p ref="copy-text-custom">copy to clipboard</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

  </div>
  <div class="d-flex flex-column align-items-center justify-content-center" style="height: 100%;" v-else>
    <div class="loader"></div>
    <div class="text-loader"></div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Asset } from '@/plugins/store'
import Modal from '@/components/Modal.vue'

type ComponentDataType = {
  keywords: string;
  isReady: boolean;
  selectedLanguage: 'vue' | 'html';
  syntax: {
    html: string;
    htmlCustomize: string;
    vueScript: string;
    vueTemplate: string;
    vueTemplateCustomize: string;
  }
}

export default {
  name: "AssetLayout",
  components: { Modal },
  props: {
    assetType: {
      type: String as PropType<'icons' | 'illustrations'>,
      default: 'icons'
    }
  },
  data: (): ComponentDataType => ({ keywords: '', isReady: false, selectedLanguage: 'html', syntax: { html: '', htmlCustomize: '', vueScript: '', vueTemplate: '', vueTemplateCustomize: '' } }),
  computed: {
    allAssets() {
      if (this.assetType === 'icons') return this.$store.getters.allIcons as Array<Asset & { preview: string }>
        return this.$store.getters.allIllustrations as Array<Asset & { preview: string }>
    },
    filtered() {
      if (this.keywords) return this.allAssets.filter(i => i.class.includes(this.keywords) || this.parseDisplayTagName(i.tag).includes(this.keywords))
      return this.allAssets
    },
    openModal() {
      return !!this.$route.query.class
    }
  },
  watch: {
    openModal(isOpen: boolean) {
      if (isOpen) this.changeSyntax(this.selectedLanguage)
      else this.selectedLanguage = 'html'
    }
  },
  mounted() {
    setTimeout(() => this.isReady = true, 1000);
    if (this.openModal) this.changeSyntax(this.selectedLanguage)
    this.checkAssets()
  },
  methods: {
    parseDisplayTagName(tag: string) {
      const parsed = tag.split(`talentics-${this.assetType}-`)[1]
      if (parsed.length >= 30) return parsed.slice(0, 27) + '...'
      return parsed
    },
    clickAsset(className: string) {
      const query = { ...this.$route.query, class: className }
      this.$router.push({ path: this.$route.path, query })
    },
    getAsset(className: string) {
      return this.allAssets.find(i => i.class === className)
    },
    checkAssets() {
      if (this.$route.query.class && !this.getAsset(this.$route.query.class as string)) {
        const query = { ...this.$route.query }
        delete query.class
        this.$router.push({ path: this.$route.path, query })
      }
    },
    changeLanguage(selected: 'vue' | 'html') {
      this.selectedLanguage = selected
      this.changeSyntax(selected)
    },
    changeSyntax(language: 'vue' | 'html') {
      const q = this.$route.query.class as string
      const assetClass = this.getAsset(q) || {} as Record<string, any>
      if (language === 'vue') {
        const name = `Talentics${this.assetType === 'icons' ? 'Icon' : 'Illustration'}${assetClass.class}`
        this.syntax.vueTemplate = `<${name} />`
        this.syntax.vueTemplateCustomize = `<${name} size="24px"${this.assetType === 'icons' ? ' color="#000000"' : ''} />`
        this.syntax.vueScript = `import ${name} from 'talentics-assets/${this.assetType}/${assetClass.class}.vue'`
      }
      else {
        this.syntax.html = `<${assetClass.tag}></${assetClass.tag}>`
        this.syntax.htmlCustomize = `<${assetClass.tag} size="24px"${this.assetType === 'icons' ? ' color="#000000"' : ''}></${assetClass.tag}>`
      }
    },
    copyToClipboard(isCustom: boolean, isVueScript: boolean = false) {
      let refSuffix = ''
      if (isVueScript) refSuffix = '-script'
      else if (isCustom) refSuffix = '-custom'
      const el = this.$refs['copy-text' + refSuffix] as HTMLElement
      const lang = this.selectedLanguage === 'vue' ? 'vueTemplate' : 'html'
      let key = isCustom ? `${lang}Customize` : lang
      if (isVueScript) key = 'vueScript'
      const val = this.syntax[key as keyof typeof this.syntax]
      navigator.clipboard.writeText(val)
      el.innerHTML = 'copied!'
      setTimeout(() => {
        el.innerHTML = 'copy to clipboard'
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.asset-modal-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  
  div {
    background-color: white;
    border-radius: 8px;
    padding: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.asset-modal-description {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 32px;

  .syntax-box {
    width: 50%;
    height: fit-content;
    border-radius: 8px;
    background-color: #001c40;

    display: flex;
    flex-direction: column;

    p {
      color: #FFFFFF;
    }

    .language-selector {
      display: flex;

      .language {
        width: 20%;
        text-align: center;
        padding: 8px;

        p {
          color: #74c0fc;
        }

        &:first-child {
          border-top-left-radius: 8px;
        }

        &:hover {
          cursor: pointer;
          background-color: #3D00C3;

          p {
            color: #FFFFFF !important;
          }
        }

        &.active {
          background-color: #183153 !important;

          p {
            color: #FFFFFF !important;
          }
        }
      }

    }

    .code {
      padding: 24px 16px !important;
      background-color: #183153 !important;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;
      padding: 18px;
      border-radius: 0 0 8px 8px;

      text-wrap: nowrap;
      overflow-x: auto;

      
      .syntax-container {
        text-wrap: wrap;
        position: relative;
        display: flex;
        justify-content: center;
        .syntax {
          color: #388ed7 !important;
          &:hover {
            cursor: pointer;
            & ~ .copy-tooltip {
              visibility: visible !important;
            }
          }
        }
      }

      .commented-lines {
        color: #6d975c;
      }

      .copy-tooltip {
        visibility: hidden;
        position: absolute;
        transform: translateY(-110%);
        background-color: #3D00C3;
        border-radius: 8px;
        padding: 8px 16px;

        &:after {
          content:'';
          position: absolute;
          top: 100%;
          left: calc(50% - 7px);
          width: 0;
          height: 0;
          border-top: solid 7px #3D00C3;
          border-left: solid 7px transparent;
          border-right: solid 7px transparent;
        }
        
        p {
          color: #FFFFFF;
        }
      }

    }
  }
}

#search-bar {
  width: 80% !important;

  h4 {
    margin: 24px 0px;
  }

  input {
    width: 50% !important;
  }
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;

  .preview {
    margin-top: 24px;
    height: 100%;
    display: flex;
    align-items: end;
  }

  .class-name {
    height: 100%;
    width: 100%;
    padding-bottom: 16px;
    text-align: center;
  }

  .card {
    margin: 4px;
    box-shadow: 0 0 5px 2px #D1D1D2;
    width: 150px;
    height: 175px;
    padding: 8px;
    
    &.lg {
      width: 250px !important;
      height: 300px !important;
    }

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      transform: scale(105%);
    }

    p {
      font-size: 16px;
      margin-top: 12px;
      color: #747474;
    }
  }
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #3D00C3 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, #3D00C3);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}

@keyframes l13 {
  100% {
    transform: rotate(1turn)
  }
}

/* HTML: <div class="loader"></div> */
.text-loader {
  width: fit-content;
  font-weight: bold;
  font-family: monospace;
  font-size: 16px;
  margin-top: 18px;
  clip-path: inset(0 100% 0 0);
  animation: l5 2s steps(11) infinite;
}

.text-loader:before {
  content: "Loading..."
}

@keyframes l5 {
  to {
    clip-path: inset(0 -1ch 0 0)
  }
}</style>