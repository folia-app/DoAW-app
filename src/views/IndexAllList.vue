<template>
  <nav class="sticky z-20 top-6 md:top-0 right-0 -mt-10 flex justify-end pointer-events-none">
    <SortButton />
  </nav>
  <TokensList :tokens="tokens" />
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import SortButton from '../components/SortButton.vue';
import { useRoute } from 'vue-router';
import TokensList from '../components/TokensList.vue';
import { useHead } from '@unhead/vue'

const route = useRoute()

const tokens = computed(() => {
  let tokens = store.state.nfts?.slice(0)
  if (tokens) {
    if (route.query.sort !== 'oldest') {
      tokens.reverse()
    }
  }
  return tokens
})

useHead(store.getters.meta({
  title: undefined,
}))
</script>