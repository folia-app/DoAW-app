<template>
  <div class="fixed z-30 overlay flex p-4">
    <!-- card -->
    <div ref="cardEl" tabindex="0" class="m-auto w-full max-w-[30em] px-4 pb-4 pt-16 flex flex-col gap-16 relative z-10 bg-grau-400 shadow-hard text-center">
      <div class="flex flex-col gap-8">
        <h6>MINT DoAW:</h6>
        <p class="leading-[2] uppercase">{{ words }}</p>
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
        <ConnectButton connectedTheme="bg-grau-600 text-black" />
        <button class="flex h-12 items-center justify-center border" :class="{'border-dotted cursor-not-allowed': !canMint}" :disabled="!canMint">
          MINT
        </button>
      </div>
      <!-- X close button -->
      <button class="absolute top-0 right-0 flex items-center justify-center pl-1 h-10 w-9 mouse:hover:bg-grau-600" aria-label="Close Mint Dialog" @click="emit('close')">X</button>
    </div>

    <!-- close btn overlay -->
    <button class="absolute overlay cursor-default" @click="emit('close')" aria-label="Close Mint Dialog"></button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import store from '../store';
import ConnectButton from '../components/ConnectButton.vue'
import { utils } from 'ethers';

const props = defineProps(['entropyHex'])
const emit = defineEmits(['close'])

const canMint = computed(() => store.getters.address)

let prevActiveEl = document.activeElement
const cardEl = ref()
onMounted(() => cardEl.value.focus())
onUnmounted(() => prevActiveEl.focus())

const hexToBytes = (hextropy) => {
  if (!hextropy) {
    return console.warn('opps:', hextropy)
  }

  var bytes = [];
  for (var c = 0; c < hextropy.length; c += 2) {
    const int = parseInt(hextropy.substr(c, 2), 16)
    if (isNaN(int)) throw new Error("Entropy is not valid hex")
    bytes.push(int);
  }
  return bytes;
}
const data = computed(() => hexToBytes(props.entropyHex))
const words = computed(() => utils.entropyToMnemonic(data.value))
</script>