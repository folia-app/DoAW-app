<template>
  <article class="fixed overlay z-30 bg-black text-white">
    <iframe :src="doawIframeUrl({ entropy })" class="absolute overlay" @load="hideInfo(5000)" @click="hideInfo(0)" />
    
    <aside class="absolute top-0 md:top-auto md:bottom-0 left-0 w-full bg-black text-white flex p-2.5 gap-3" :class="{'opacity-0': !infoVisible}" @mouseenter="showInfo" @mouseleave="hideInfo(0)">
      <button class="px-4 border flex items-center justify-center flex-shrink-0" @click="goBack">&lt;&lt;</button>
      <!-- TODO single line like splash (disappears tho) -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex gap-3">
          <div>DoAW:<a :href="store.getters.openSeaLink({ tokenId })" class="underline" target="_blank" rel="noreferrer">#{{ ('00' + (index+1)).slice(-3) }}</a></div>
        </div>
        <div class="truncate">
          OWNER:<a :href="store.getters.openSeaLink({ account: owner })" class="underline" target="_blank" rel="noreferrer"><Addr  :address="owner" /></a>
        </div>
        
        <!-- <div class="hidden md:flex gap3">
          <div>SEEDPHRASE:</div>
          <div>
            <span v-for="word in mnemonic.split(' ')" :key="word" class="inline-block pr-3 uppercase" :style="{'colorff': stringToHexColor(word)}">
              {{ word }}
            </span>
          </div>
        </div> -->

        <!-- <div class="hidden md:block truncate">PRIVATEKEY_0: {{ privateKey0 }}</div> -->
        <!-- <div class="hidden md:block truncate">WALLET[0]: <a :href="store.getters.etherscanLink({ address: address0 })" class="underline" target="_blank" rel="noopener noreferrer">{{address0}}</a></div> -->
        <!-- <div class="truncate">OWNER: 
          <span v-if="!owner" class="animate-blink">...</span>
          <a v-else :href="store.getters.openSeaLink({ account: owner })" class="underline" target="_blank" rel="noreferrer">
            <Addr  :address="owner" />
          </a>
        </div> -->
      </div>
    </aside>
  </article>
</template>

<script setup>
  import { onUnmounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import doawIframeUrl from '../utils/doawIframeUrl';
  import Addr from '../components/Addr.vue';
  import store from '../store'
  import { ethers } from 'ethers'
  import hexToBytes from '../utils/hexToBytes';
  import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
  import stringToHexColor from '../utils/stringToHexColor';

  const route = useRoute()
  const tokenId = route.params.tokenId.toString()

  const entropy = tokenIdtoEntropy(tokenId)
  const mnemonic = ethers.utils.entropyToMnemonic(hexToBytes(entropy))

  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic)
  const privateKey0 = hdNode.derivePath(ethers.utils.defaultPath).privateKey
  const wallet = new ethers.Wallet(privateKey0)
  const address0 = wallet.address

  const owner = computed(() => store.state.nfts?.find(nft => nft.tokenId === tokenId)?.owner)
  const index = computed(() => store.state.nfts?.findIndex(nft => nft.tokenId === tokenId))

  const isRunning = ref(false)
  const isPlaying = ref(false)

  const infoVisible = ref(true)
  let hideInfoTimeout

  function showInfo() {
    clearTimeout(hideInfoTimeout)
    infoVisible.value = true
  }

  function hideInfo (delay = 0) {
    if (!isPlaying.value) return
    console.log('hide')
    clearTimeout(hideInfoTimeout)
    hideInfoTimeout = setTimeout(() => { infoVisible.value = false }, delay)
  }

  function listenToMessages (event) { 
    if (event.origin === import.meta.env.VITE_SERVER) {
      if (event.data === 'run') {
        isRunning.value = true
        isPlaying.value = true
        hideInfo(1000)
      } else {
        isPlaying.value = !isPlaying.value
        return !isPlaying.value ? showInfo() : hideInfo()
      }
    }
  }
  window.addEventListener('message', listenToMessages)
  onUnmounted(() => window.removeEventListener('message', listenToMessages))
</script>

<script>
  // import { RouteLocation } from 'vue-router';
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