<template>
  <div :class="`modal-container ${isOpen ? 'modal-active' : 'modal-inactive'}`">
    <div class="modal-background" @click="closeModal($event)">
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

export default {
  name: "Modal",
  props: {
    isOpen: {
      type: Boolean as PropType<boolean>,
    }
  },
  methods: {
    closeModal(e: any) {
      const backgroundLists = ['modal-background', 'asset-modal-preview', 'asset-modal-description', 'content']
      backgroundLists.forEach(v => {
        if (e.target.classList.contains(v)) {
          const query = { ...this.$route.query }
          delete query.class
          this.$router.push({ path: this.$route.path, query })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: rgba(0, 0, 0, .6);
  opacity: 1;

  &.modal-active {
    transform: scale(1);
  }

  &.modal-inactive {
    transform: scale(0);
  }


  .modal-background {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>