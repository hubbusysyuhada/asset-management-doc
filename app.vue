<template>
  <Head>
    <Title>Talentics Assets Doc</Title>
  </Head>
  <div v-if="$store.state.isInitiated" id="root">
    <sidebar />
    <div style="width: 100%;">
      <div id="top-navbar">
        <Npm size="26" class="icon" @click="goToNpm"/>
        <Github class="icon" @click="goToGithubRepo"/>
        <select class="form-select form-select-sm version-select" aria-label="Default select example" @change="changeVersion($event)" v-model="currentVersionIndex">
          <option v-for="(version, index) in versions.map(v => v.version)" :value="index" :key="index">{{ version }}</option>
        </select>
      </div>
      <div id="content">
        <RouterView />
      </div>
    </div>
  </div>
  <div v-else id="root-loading">
    <Loader/>
  </div>
</template>

<script lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Loader from '@/components/Loader.vue';
import Github from 'talentics-assets/icons/Github.vue'

import Npm from 'talentics-assets/icons/Npm.vue'

export default {
  name: "Root",
  components: { Sidebar, Github, Npm, Loader },
  methods: {
    goToGithubRepo: () => window.open("https://github.com/hubbusysyuhada/asset-management", "_blank"),
    goToNpm: () => window.open("https://www.npmjs.com/package/talentics-assets", "_blank"),
    changeVersion(e: any) {
      const version = this.$store.state.versions[e.target.value].version
      const query = { ...this.$route.query, version }
      this.$router.push({ path: this.$route.path, query })
      this.$store.commit('changeActiveVersionIndex', e.target.value)
    }
  },
  beforeMount() {
    const version = this.$route.query.version || ''
    this.$store.dispatch('validateVersion', { version, redirect: () => this.$router.push(this.$route.path) })
    this.$store.dispatch('fetchVersion')
  },
  computed: {
    versions() {
      return this.$store.state.versions
    },
    currentVersionIndex() {
      return this.$store.state.currentVersionIndex
    }
  }
}
</script>

<style>
p, h1, h2, h3, h4, h5 {
  font-family: "Slabo 27px", serif;
  margin: 0;
  color: #343336;
}

#root {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

#root-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#content {
  width: 100%;
  overflow: auto;
  height: calc(95vh - 60px);
  padding-bottom: 32px;
}

#top-navbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  padding-right: 32px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.icon {
  margin-right: 8px;
  &:hover {
    cursor: pointer;
  }
}

.version-select {
  width: 200px;
}
</style>