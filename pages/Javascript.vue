<template>
  <div>
    <div class="section">
      <h4>Installation</h4>
      <div class="sub-section">
        <p>1. If you were using any front end frameworks that use node js as it's base, you could install the package by using code below in your terminal.</p>
        <CodeSnippet class="code-container" text="npm i --save talentics-assets"/>
        <p>2. Call it in your root javascript file so it could be used globally throughout the app.</p>
        <CodeSnippet class="code-container" text="require('talentics-assets')"/>
        <p>3. Or you could skip step 1 and 2 if you are using CDN just by copying this script below into your HTML file.</p>
        <CodeSnippet class="code-container" :text="cdnUrl + '>'"/>
        <p>4. Browse and use your selected icons/illustrations given in the assets section.</p>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CodeSnippet from '~/components/CodeSnippet.vue';
export default {
  name: "JavascriptInstallationPage",
  components: { CodeSnippet },
  computed: {
    cdnUrl() {
      return `<script src="https://cdn.jsdelivr.net/npm/talentics-assets@${this.$store.getters['activeVersion'].version}/index.min.js"></script`
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  margin: 32px;
}

.sub-section {
  margin: 16px;

  p {
    margin: 8px;
  }
}

.code-container {
  margin-left: 60px;
  width: 800px;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>