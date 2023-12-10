<template>
  <article>
    <section class="flex flex-col h-screen" :style="{height: winH + 'px'}">
      <!-- fills remaining screen after bottom bars -->
      <div class="relative flex-1">
        <iframe ref="iframeEl" :src="iframeUrl" class="absolute overlay" />
      </div>

      <!-- (bottom bar) -->
      <div v-if="uiVisible" class="flex flex-wrap px-3 py-2.5 gap-2.5">
        <ConnectButton class="w-full md:w-auto md:flex-1" />

        <button class="h-12 flex-1 flex items-center justify-center border min-w-[40%] md:min-w-0" @click="toggleIframePlayback()" :disabled="!isRunning" :class="{'opacity-50 border-dotted': !isRunning}">
          {{ isPlaying || !isRunning ? 'PAUSE' : 'PLAY' }}
        </button>
        
        <button class="h-12 flex-1 flex items-center justify-center border min-w-[40%] md:min-w-0" @click="onMintButtonClick">
          MINT
        </button>

        <div class="h-12 flex-1 flex flex-col justify-evenly min-w-[75%] md:min-w-0">
          <div class="w-full flex justify-between">
            <div>MINTED:</div>
            <div>
              <template v-if="mintCount !== undefined">{{ mintCount }}</template><span v-else class="animate-blink">...</span>/<template v-if="maxSupply !== undefined">{{ maxSupply }}</template><span v-else class="animate-blink">...</span>
            </div>
          </div>
          <div class="max-w-full flex justify-between">
            <div class="pr-[0.5em]">PRICE:</div>
            <div class="flex-1 min-w-0 truncate text-right">
              <template v-if="$store.state.price">
                {{ $store.getters.weiToETH($store.state.price) }}
              </template>
              <span v-else class="animate-blink">...</span>
            </div>
            <div>&nbsp;ETH</div>
          </div>
        </div>
        <button class="w-12 h-12 flex-shrink-0 flex items-center justify-center border" @click="infoModalVisible = true">
          ?
        </button>

        <!-- <button class="w-12 h-12 flex-shrink-0 flex items-center justify-center border">
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.04492 0.300781V2.01465H7.33203V3.72852H5.61816V5.44238H3.9043H2.19043H0.476562V7.15625V8.87012V10.584H2.19043H3.9043H5.61816V12.2979H7.33105V14.0117H9.04492H9.0459V15.7256H10.7598V14.0117H10.7588V12.2979V10.584V8.87012V7.15625V5.44238V3.72852V2.01465V0.300781H9.04492Z" fill="black"/>
            <rect x="17.6143" y="7.15674" width="1.71289" height="5.1416" transform="rotate(90 17.6143 7.15674)" fill="black"/>
          </svg>
        </button> -->
      </div>
      <!-- <div class="h-10"></div> -->
    </section>

    <MintModal v-if="mintModalVisible" @close="onMintModalClose" :entropyHex="entropyHex" />
    <InfoModal v-if="infoModalVisible" @close="infoModalVisible = false" />

    <section v-if="uiVisible" id="index" class="min-h-[66vh] flex flex-col">
      <!-- sticky-top grid nav bar -->
      <nav class="sticky z-20 top-0 left-0 w-full h-10 flex items-center gap-[0.5em] leading-snug px-3 bg-neutral-900">
        <div>LIST:</div>
        <router-link to="/" class="px-[0.75em] pt-px">{{ isLoggedIn ? 'ALL' : 'WALLETS' }}</router-link>
        <router-link v-if="isLoggedIn" to="/yours" class="px-[0.75em] pt-px">YOURS</router-link>
        <router-link to="/owners" class="px-[0.75em] pt-px">OWNERS</router-link>
      </nav>
      
      <!-- grid pages -->
      <div class="flex-1">
        <router-view></router-view>
      </div>
    </section>   
  </article>
</template>

<script setup>
import ConnectButton from '../components/ConnectButton.vue'
import InfoModal from '../components/InfoModal.vue';
import MintModal from '../components/MintModal.vue'
import store from '../store';
import { computed, onUnmounted, ref } from 'vue';

const iframeUrl = import.meta.env.VITE_SERVER
const winH = window.innerHeight

const isLoggedIn = computed(() => store.getters.address)
const mintCount = computed(() => store.getters.mintCount)
const maxSupply = computed(() => store.state.maxSupply)

// delay for rpc.sepolia (rabby wallet)
setTimeout(() => store.dispatch('getMaxSupply'), 500)
setTimeout(() => store.dispatch('getPrice'), 1000)

const iframeEl = ref()
const mintModalVisible = ref(false)
const infoModalVisible = ref(false)

function openMintModal () {
  mintModalVisible.value = true
}

const uiVisible = ref(localStorage.getItem('hasStarted') ?? false)
const isRunning = ref(false)
const isPlaying = ref(false)
const entropyHex = ref()

function listenToMessages (event) { 
  // Handle the received message data
  if (event.origin === iframeUrl) {
    console.log('iframe message:', event.data)
    if (event.data === 'run') {
      isRunning.value = true
      isPlaying.value = true
      uiVisible.value = true
      localStorage.setItem('hasStarted', 1)
    } else {
      isPlaying.value = !isPlaying.value
      entropyHex.value = event.data
    }
  }
}

function toggleIframePlayback () {
  iframeEl.value.contentWindow.postMessage('pause', iframeUrl)
}

let wasPlaying
function onMintButtonClick () {
  wasPlaying = isPlaying.value
  // pause iframe?
  if (isPlaying.value) {
    toggleIframePlayback()
  }
  // should have hex?
  setTimeout(() => {
    // console.log(entropyHex.value)
    openMintModal()
  }, 100)
}

function onMintModalClose () {
  mintModalVisible.value = false
  if (isRunning.value && wasPlaying && !isPlaying.value) {
    toggleIframePlayback()
  }
}

window.addEventListener('message', listenToMessages)
onUnmounted(() => window.removeEventListener('message', listenToMessages))
</script>

<style scoped>
nav .router-link-exact-active{
  background:white;
  color:black;
}

@screen mouse {
  nav :not(.router-link-exact-active):hover{
    background: white;
    color:black;
  }
}
</style>