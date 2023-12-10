<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive include="Index">
        <component :is="Component" />
      </keep-alive>
    </router-view>
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