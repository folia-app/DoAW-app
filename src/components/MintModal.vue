<template>
  <div class="fixed z-30 overlay flex px-4 py-12 overflow-scroll">
    <!-- card -->
    <div ref="cardEl" tabindex="0" class="m-auto w-full max-w-[30em] p-4 flex flex-col relative z-10 bg-black text-white border ffshadow-hard text-center">
      <div class="flex flex-col gap-6 py-10">
        <h6>MINT DoAW:</h6>
        <p class="leading-[2] uppercase">
          <span v-for="word in words.split(' ')" :key="word" class="inline-block pr-3" :style="{'color': stringToHexColor(word)}">
            {{ word }}
          </span>
        </p>
        <div>?</div>
      </div>
      <div class="flex flex-col gap-3">
        <!-- price -->
        <div class="flex gap-1">
          <div>PRICE:</div>
          <div class="flex-1 min-w-0 truncate text-right">
            {{ $store.getters.weiToETH($store.state.price) }}
          </div>
          <div>ETH</div>
        </div>
        <ConnectButton connectedTheme="bg-neutral-900 text-white" />
        <button class="flex h-12 items-center justify-center border" :class="{'border-dotted opacity-50 cursor-not-allowed': !canMint}" :disabled="!canMint" @click="mint(props.entropyHex)">
          MINT
        </button>
        
        <!-- (mint status) -->
        <div v-if="status" class="py-1" :class="{'bg-red-300': status.type === 'error', 'bg-green-300': status.type === 'success', 'bg-grau-600': !status.type, 'animate-blink-slow': status.message.includes('...')}">
          {{ status.message }}
        </div>
        <!-- (tx msgs...) -->
        <TxList v-else :txs="txs" />
      </div>
      <!-- X close button -->
      <button class="absolute top-0 right-0 flex items-center justify-center pl-1 h-10 w-9 mouse:hover:bg-neutral-800" aria-label="Close Mint Dialog" @click="emit('close')">X</button>
    </div>

    <!-- close btn overlay -->
    <button class="absolute overlay cursor-default" @click="emit('close')" aria-label="Close Mint Dialog"></button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import store from '../store';
import ConnectButton from '../components/ConnectButton.vue'
import TxList from '../components/TxList.vue'
import { utils } from 'ethers';
import hexToBytes from '../utils/hexToBytes';
import stringToHexColor from '../utils/stringToHexColor';

const props = defineProps(['entropyHex'])
const emit = defineEmits(['close'])

const canMint = computed(() => store.getters.address)

let prevActiveEl = document.activeElement
const cardEl = ref()
onMounted(() => cardEl.value.focus())
onUnmounted(() => prevActiveEl.focus())

const data = computed(() => props.entropyHex && hexToBytes(props.entropyHex))
const words = computed(() => data.value && utils.entropyToMnemonic(data.value))

// minting
const status = ref()
const txs = computed(() => store.state.pending.filter(tx => tx.name === 'mint'))
async function mint(entropy) {
  try {
    if (!entropy) {
      throw new Error('input missing. click START before minting')
    }
    
    status.value = { message: 'confirm tx in your wallet...' }
    await store.dispatch('mint', '0x' + entropy)
    status.value = null
  } catch (error) {
    console.error(error)
    let message
    // look for part of error that begins reason=" and ends with another double quotation mark
    const match = error.toString().match(/reason="([^"]*)"/)
    if (match) {
      message = match[1]
    }else {
      message = error.toString().replace("Error: ", "")
    }
    const result = { type: 'error', message }
    status.value = result
    // setTimeout(() => {
    //   if (status.value.message === result.message)
    //     status.value = null
    // }, 5000)
    // store.dispatch('popup', popup)
  }
}
</script>