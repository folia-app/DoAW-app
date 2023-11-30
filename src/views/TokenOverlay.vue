<template>
  <article class="fixed overlay z-30 bg-grau-400">
    <iframe :src="`${iframeUrl}/nft.html#${tokenId}`" class="absolute overlay" />
    
    <footer class="absolute bottom-0 left-0 w-full bg-grau-400 flex p-2.5 gap-2.5">
      <div class="flex-1 flex flex-col justify-evenly">
        <div class="truncate">ID: {{ entropy }}</div>
        <div class="truncate">PASSPHRASE: {{ mneumonic }}</div>
        <div class="truncate">OWNER: ...</div>
      </div>
      <button class="w-14 h-14 border flex items-center justify-center flex-shrink-0 pl-[0.3em]" @click="goBack">X</button>
    </footer>
  </article>
</template>

<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute()

  const tokenId = route.params.tokenId.toString()
  console.log({tokenId})
  const entropy = BigInt(tokenId).toString(32)
  console.log({entropy})
  const mneumonic = hexToBytes(entropy)

  const iframeUrl = import.meta.env.VITE_SERVER
</script>

<script>
// import { RouteLocation } from 'vue-router';
import hexToBytes from '../utils/hexToBytes';
let lastRt // : RouteLocation | undefined
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