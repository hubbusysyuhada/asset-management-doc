<template>
  <div class="code">
    <p @click="copyText">{{ text }}</p>
    <div class="copy-tooltip">
      <p ref="copy-text">copy to clipboard</p>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: "CodeSnippet",
  props: {
    text: {
      type: String,
      required: true
    },
  },
  methods: {
    copyText() {
      const tooltipTextEl = this.$refs['copy-text'] as HTMLElement
      navigator.clipboard.writeText(this.text)
      tooltipTextEl.innerHTML = 'copied!'
      setTimeout(() => {
        tooltipTextEl.innerHTML = 'copy to clipboard'
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  border-radius: 8px;
  background-color: #001c40;
  padding: 24px 50px 24px 16px;

  p {
    color: #74c0fc;

    &:hover {
      cursor: pointer;

      & ~ .copy-tooltip {
        visibility: visible;
      }
    }
  }

  .copy-tooltip {
    visibility: hidden;
    position: absolute;
    transform: translateY(-70px);
    background-color: #3D00C3;
    border-radius: 8px;
    padding: 8px 16px;
    p {
      color: #FFFFFF;
    }
  }
}
</style>