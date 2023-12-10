<script setup>
import Addr from '../components/Addr.vue';
const props = defineProps({
  connectedTheme: {
    default: 'bg-white text-black'
  }
})
</script>

<template>
  <div class="connect-btn flex">
    <!-- (connected) -->
    <template v-if="$store.getters.address">
      <div class="flex-1 flex h-12 text-left" :class="props.connectedTheme">
        <div class="flex-1 min-w-0 flex flex-col justify-between py-2 px-2.5 leading-none">
          <div>CONNECTED:</div>
          <div class="truncate">
            <Addr :address="$store.getters.address" />
          </div>
        </div>
        <button class="w-12 h-12 flex items-center justify-center pl-0.5 flex-shrink-0" @click="$store.dispatch('disconnect')">X</button>
      </div>
    </template> 
    <!-- (connect btn) -->
    <template v-else>
      <button class="flex-1 flex h-12 items-center justify-center border" @click="$store.dispatch('connect')">
        CONNECT WALLET
      </button>
    </template>
  </div>
</template>