<template>
  <article class="fixed overlay z-30 bg-grau-400">
    <iframe :src="doawIframeUrl({ entropy })" class="absolute overlay" @load="hideInfo(5000)" @click="hideInfo(0)" />
    
    <aside class="absolute top-0 left-0 w-full bg-grau-400 flex p-2.5 gap-2.5" :class="{'opacity-0': !infoVisible}" @mouseenter="showInfo" @mouseleave="hideInfo(0)">
      <button class="w-14 h-14 border flex items-center justify-center flex-shrink-0 pl-[0.3em]" @click="goBack">X</button>
      <div class="flex-1 flex flex-col justify-evenly">
        <div>DOAW: <a :href="store.getters.openSeaLink({ tokenId })" class="underline" target="_blank" rel="noreferrer">{{ ('00' + (index+1)).slice(-3) }}</a></div>
        <div class="truncate">ENTROPY: {{ entropy }}</div>
        <div class="truncate">MNEUMONIC: {{ mneumonic.toUpperCase() }}</div>
        <div class="truncate">OWNER: 
          <span v-if="!owner" class="animate-blink">...</span>
          <a v-else :href="store.getters.openSeaLink({ account: owner })" class="underline" target="_blank" rel="noreferrer">
            <Addr  :address="owner" />
          </a>
        </div>
      </div>
    </aside>
  </article>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import doawIframeUrl from '../utils/doawIframeUrl';
  import Addr from '../components/Addr.vue';
  import store from '../store'

  const route = useRoute()
  const tokenId = route.params.tokenId.toString()
  const owner = computed(() => store.state.nfts?.find(nft => nft.tokenId === tokenId)?.owner)
  const index = computed(() => store.state.nfts?.findIndex(nft => nft.tokenId === tokenId))

  const entropy = tokenIdtoEntropy(tokenId)
  const mneumonic = computed(() => utils.entropyToMnemonic(hexToBytes(entropy)))

  // info visibility
  const infoVisible = ref(true)
  let hideInfoTimeout
  // function onMousemove () {
  //   console.log('movi')
  //   clearTimeout(hideInfoTimeout)
  //   infoVisible.value = true
  //   hideInfo(0)
  // }
  function showInfo() {
    clearTimeout(hideInfoTimeout)
    infoVisible.value = true
  }

  function hideInfo (delay) {
    console.log('hide')
    clearTimeout(hideInfoTimeout)
    hideInfoTimeout = setTimeout(() => { infoVisible.value = false }, delay)
  }
</script>

<script>
  // import { RouteLocation } from 'vue-router';
  import hexToBytes from '../utils/hexToBytes';
  import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
import { utils } from 'ethers';
import { computed } from 'vue';
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