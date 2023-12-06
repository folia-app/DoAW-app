<template>
<Modal maxWidth="30em">
  <div class="flex flex-col gap-6 py-10">
    <h6 class="pl-2">MINT DoAW:</h6>
    <p v-if="!words" class="text-center text-yellow-400">
      click <br> "DoAW START" <br> to generate <br> a SEEDPHRASE
    </p>
    <template v-else>
      <p class="leading-[2] uppercase">
        <span v-for="word in words.split(' ')" :key="word" class="inline-block pr-3" :style="{'color': stringToHexColor(word)}">
          {{ word }}
        </span>
      </p>
      <div class="-mt-0.5">?</div>
      <!-- <div class="flex justify-center">
        <button class="p-2 -my-2"><SvgRefresh class="h-[1.3em]" /></button>
      </div> -->
    </template>
  </div>
  <div class="flex flex-col gap-3">
    <div>
      <!-- price -->
      <div class="flex gap-1">
        <div>PRICE:</div>
        <div class="flex-1 min-w-0 truncate text-right">
          <span v-if="!store.state.price" class="animate-blink">...</span>
          <template v-else>{{store.getters.weiToETH(store.state.price)}}</template>
        </div>
        <div>ETH</div>
      </div>
      <!-- minted -->
      <!-- <div class="flex gap-1">
        <div>MINTED:</div>
        <div class="flex-1 min-w-0 truncate text-right">
          {{ $store.state.nfts?.length ?? '...' }}/{{ $store.state.maxSupply ?? '...' }}
        </div>
      </div> -->
    </div>
    <ConnectButton v-if="!isSoldOut" connectedTheme="bg-neutral-900 text-white" />
    <button class="flex h-12 items-center justify-center border" :class="{'border-dotted opacity-50 cursor-not-allowed': !canMint || !props.entropyHex}" :disabled="!canMint || !props.entropyHex" @click="mint({ entropy: props.entropyHex })">
      {{ isSoldOut ? 'SOLD OUT' : 'MINT' }}
    </button>
    <div v-if="!isSoldOut" class="flex border h-12" :class="{'border-dotted opacity-50 cursor-not-allowed': !canMint}">
      <button class="flex-1 flex items-center justify-center" :disabled="!canMint" @click="mint({ quantity: qty })">
        MINT RANDOM
      </button>
      <div class="w-14 flex flex-col border-l" :class="{'border-dotted': !canMint}">
        <button class="flex-1 flex items-center justify-center pl-1" :class="{'bg-white text-black': qty === 1}" @click="qty = 1">1x</button>
        <button class="flex-1 flex items-center justify-center pl-1" :class="{'bg-white text-black': qty === 3}" @click="qty = 3" :disabled="button3xDisabled">3x</button>
      </div>
    </div>
    <a v-else :href="store.getters.openSeaLink({})" target="_blank" rel="noopener noreferer" class="h-12 flex items-center justify-center border">
      VIEW SECONDARY
    </a>
    <!-- (mint status) -->
    <div v-if="status" class="py-1 text-black" :class="{'bg-red-300': status.type === 'error', 'bg-green-300': status.type === 'success', 'bg-grau-200': !status.type, 'animate-blink-slow': status.message.includes('...')}">
      {{ status.message }}
    </div>
    <!-- (tx msgs...) -->
    <TxList v-else :txs="txs" @viewMint="onViewMint" />
  </div>
</Modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import store from '../store';
import ConnectButton from '../components/ConnectButton.vue'
import TxList from '../components/TxList.vue'
import { utils } from 'ethers';
import hexToBytes from '../utils/hexToBytes';
import stringToHexColor from '../utils/stringToHexColor';
import Modal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
// import SvgRefresh from '../components/SvgRefresh.vue'

const props = defineProps(['entropyHex'])
const emit = defineEmits('close')

const isSoldOut = computed(() => store.getters.isSoldOut)
const canMint = computed(() => store.getters.address && !isSoldOut.value)

const data = computed(() => props.entropyHex && hexToBytes(props.entropyHex))
const words = computed(() => data.value && utils.entropyToMnemonic(data.value))

// minting
const qty = ref(1)
const status = ref()
const txs = computed(() => store.state.pending.filter(tx => tx.name === 'mint'))
const button3xDisabled = computed(() => store.state.maxSupply - store.state.nfts?.length < 0)

async function mint({ entropy, quantity = 1 }) {
  try {
    // !! can't mint 3 / almost sold out
    if (quantity === 3 && button3xDisabled.value) {
      qty.value = 1
      throw new Error("can't mint 3 (almost sold out)")
    } 

    status.value = { message: 'confirm tx in your wallet...' }
    const params = entropy ? { entropy: '0x' + entropy } : { quantity }
    await store.dispatch('mint', params)
    status.value = null
  } catch (error) {
    console.error(error)
    let message
    // look for part of error that begins reason=" and ends with another double quotation mark
    const match = error.toString().match(/reason="([^"]*)"/)
    if (match) {
      message = match[1]
    } else {
      message = error.toString().replace("Error: ", "")
    }
    const result = { type: 'error', message }
    status.value = result
    // setTimeout(() => {
    //   if (status.value.message === result.message)
    //     status.value = null
    // }, 5000)
  }
}

// close modal if route changes (click to "view" your collection from mint success tx)
const route = useRoute()
const router = useRouter()
watch(() => route.path, () => emit('close'))

function onViewMint () {
  emit('close')
  router.push('/yours#index')
}
</script>