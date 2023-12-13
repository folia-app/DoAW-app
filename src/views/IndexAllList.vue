<template>
  <TokensList :tokens="tokens" />
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
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