<template>
  <nav class="sticky z-20 top-6 md:top-0 right-0 -mt-10 flex justify-end pointer-events-none">
    <SortButton />
  </nav>
  <div class="flex bg-neutral-800 text-white sticky top-16 md:top-10 z-20">
    <div class="flex-1 flex relative px-2.5 h-10 items-center gap-3">
      <div>OWNER:</div>
      <div class="flex-1 min-w-0 truncate">
        <a :href="$store.getters.openSeaLink({account: route.params.address})" target="_blank" rel="noopener noreferrer" class="underline">
          <Addr :address="route.params.address" />
        </a>
      </div>
    </div>
    <router-link class="px-2.5 h-10 flex items-center mouse:hover:bg-[rgba(255,255,255,0)]" to="/">X</router-link>
  </div>
  <TokensList :tokens="tokens" />
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import SortButton from '../components/SortButton.vue';
import { useRoute } from 'vue-router';
import TokensList from '../components/TokensList.vue';
import Addr from '../components/Addr.vue';
import { useHead } from '@unhead/vue'

const route = useRoute()
const address = route.params.address?.toLowerCase()

const tokens = computed(() => {
  let tokens = store.state.nfts?.slice(0).filter(token => token.owner.toLowerCase() === address)
  if (tokens) {
    if (route.query.sort !== 'oldest') {
      tokens.reverse()
    }
  }
  return tokens
})

store.dispatch('ensName', address).then((name) => {
  useHead(store.getters.meta({
    title: name || address,
    image: false
  }))
})
</script>