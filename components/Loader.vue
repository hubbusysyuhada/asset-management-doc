<template>
  <div>
    <div class="loader"></div>
    <div class="text-loader"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Loader"
}
</script>

<style lang="scss">
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
}
</style>