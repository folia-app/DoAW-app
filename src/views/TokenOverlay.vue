<template>
  <article class="fixed overlay z-30 bg-black text-white">
    <iframe :src="doawIframeUrl({ entropy })" class="absolute overlay" @load="hideInfo(5000)" @click="hideInfo(0)" />
    
    <aside class="absolute top-0 left-0 w-full bg-black text-white flex p-2.5 gap-3" :class="{'opacity-0': !infoVisible}" @mouseenter="showInfo" @mouseleave="hideInfo(0)">
      <button class="px-4 border flex items-center justify-center flex-shrink-0" @click="goBack">&lt;&lt;</button>
      <div class="flex-1 flex flex-col justify-evenly">
        <div><a :href="store.getters.openSeaLink({ tokenId })" class="underline" target="_blank" rel="noreferrer">#{{ ('00' + (index+1)).slice(-3) }}</a></div>
        <div class="truncate">ENTROPY: {{ entropy }}</div>
        <div class="truncate">MNEUMONIC: 
          <span v-for="word in mneumonic.split(' ')" :key="word" class="inline-block pr-3 uppercase" :style="{'color': stringToHexColor(word)}">
            {{ word }}
          </span>
        </div>
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
import stringToHexColor from '../utils/stringToHexColor';
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