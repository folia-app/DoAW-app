<template>
  <template v-if="!$store.getters.address">
    <p class="py-2 px-2.5">(connect your ethereum wallet ^)</p>
  </template>

  <template v-else>
    <nav class="sticky z-20 top-0 right-0 -mt-10 flex justify-end pointer-events-none">
      <SortButton />
    </nav>
    <!-- <div class="flex bg-neutral-800 text-white sticky top-10 z-20">
      <div class="flex-1 flex relative px-2.5 h-10 items-center gap-3">
        <div>CONNECTED:</div>
        <div class="flex-1 min-w-0 truncate">
          <a :href="$store.getters.openSeaLink({account: store.getters.address})" target="_blank" rel="noopener noreferrer" class="underline">
            <Addr :address="store.getters.address" />
          </a>
        </div>
      </div>
      <button class="px-2.5 h-10 flex items-center mouse:hover:bg-[rgba(255,255,255,0)]" @click="$store.dispatch('disconnect')">X</button>
    </div> -->
    <TokensList :tokens="tokens" />
  </template>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import SortButton from '../components/SortButton.vue';
import { useRoute } from 'vue-router';
import TokensList from '../components/TokensList.vue';
import Addr from '../components/Addr.vue';

const route = useRoute()

const tokens = computed(() => {
  let tokens = store.state.nfts?.slice(0).filter(token => token.owner.toLowerCase() === store.getters.address?.toLowerCase())
  if (tokens) {
    if (route.query.sort !== 'oldest') {
      tokens.reverse()
    }
  }
  return tokens
})
</script>