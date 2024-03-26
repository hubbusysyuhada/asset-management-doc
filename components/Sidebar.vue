<template>
  <div id="sidebar">
    <p class="header">Getting Started</p>
    <p :class="`subheader ${activeRoute('javascript') ? 'active' : ''}`" @click="goToPage('javascript')">Vanilla Javascript</p>
    <p :class="`subheader ${activeRoute('vue') ? 'active' : ''}`" @click="goToPage('vue')">Vue</p>
    <p class="header">Assets</p>
    <p :class="`subheader ${activeRoute('icon-system') ? 'active' : ''}`" @click="goToPage('icon-system')">Icon System</p>
    <p :class="`subheader ${activeRoute('illustration-asset') ? 'active' : ''}`" @click="goToPage('illustration-asset')">Illustration Asset</p>
    <p :class="`subheader ${activeRoute('icon-special-case') ? 'active' : ''}`" @click="goToPage('icon-special-case')">Icon Special Case</p>
    <p :class="`subheader ${activeRoute('icon-illustration') ? 'active' : ''}`" @click="goToPage('icon-illustration')">Icon Illustration</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "Sidebar",
  methods: {
    goToPage(path: string) {
      this.$router.push({ path, query: this.$route.query })
    },
    activeRoute(arg: string) {
      return `/${arg}` === this.$route.path
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
#sidebar {
  width: 250px;
  height: 100vh;
  border-right: 0.5px solid #D1D1D2;
  margin-right: 16px;
  padding-top: 21px;
  padding-left: 21px;
  margin-top: 50px;
  height: calc(100vh - 100px);
}

.header {
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}

.subheader {
  margin-left: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 4px 8px;
  width: fit-content;

  &:hover {
    cursor: pointer;
    background-color: #F9F5FE;
    border-radius: 8px;
    color: #3D00C3;
  }

  &.active {
    background-color: #F9F5FE;
    border-radius: 8px;
    color: #3D00C3;
    font-weight: bold;
  }
}
</style>