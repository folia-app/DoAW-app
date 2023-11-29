<template>
<article class="fixed overlay z-30 bg-grau-400">
  <iframe src="http://127.0.0.1:3000" class="absolute overlay" />
  
  <footer class="absolute bottom-0 left-0 w-full bg-grau-400 flex p-2.5 gap-2.5">
    <div class="flex-1 flex flex-col justify-evenly">
      <div class="truncate">ID: ...</div>
      <div class="truncate">PASSPHRASE: ...</div>
      <div class="truncate">OWNER: ...</div>
    </div>
    <button class="w-14 h-14 border flex items-center justify-center flex-shrink-0 pl-[0.3em]" @click="goBack">X</button>
  </footer>
</article>
</template>

<script lang="ts">
import { RouteLocation } from 'vue-router';
let lastRt: RouteLocation | undefined
export default {
  methods: {
    goBack () {
      if (lastRt?.name) {
        return this.$router.go(-1)
      }
      // go to parent (remove tokens/... path)
      return this.$router.push(this.$route.path.split('tokens')[0])
    }
  },
  beforeRouteEnter (_, from, next) {
    lastRt = from
    next()
  }
}
</script>