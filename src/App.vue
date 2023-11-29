<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
  
<script lang="ts">
export default {
  watch: {
    '$route' (to) {
      const isTokenOverlay = to.path.includes('tokens/')
      // lock scrolling for overlays
      document.body.style.overflow = isTokenOverlay ? 'hidden' : 'auto'
    }
  }
}
</script>