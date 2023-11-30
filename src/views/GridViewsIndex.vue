<template>
  <!-- child route as overlay (token view) -->
  <router-view />
  <nav class="sticky z-20 top-0 right-0 -mt-10 pointer-events-none flex justify-end pointer-events-none">
    <button class="h-10 px-2.5 flex items-center justify-end pointer-events-auto" @click="toggleSort">
      {{ isSortNewest ? 'NEWEST↓' : 'OLDEST↓' }}
    </button>
  </nav>
  <section class="relative z-10">
    <template v-if="!tokens">
      <p class="animate-blink">
        loading...
      </p>
    </template>
    <template v-else>
      <ul class="grid gap-px bg-black" :style="`grid-template-columns: repeat(${gridCols}, minmax(0, 1fr));`">
        <template v-for="_, index in demoTokens.slice(0, pageSize)">
          <NFTThumb v-for="token in tokens" :key="token.tokenId + index" :token="token" />
        </template>
      </ul>

      <!-- lazy page loader -->
      <Observer v-if="pageSize < demoTokens.length" class="min-h-[90vh] flex items-center justify-center text-3xs animate-blink" :threshold="0.01" @visible="pageSize = pageSize + pageSizeStep">
        <div class="sticky bottom-8 left-0 w-full text-center">loading...</div>
      </Observer>
    </template>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import store from '../store';
import NFTThumb from '../components/NFTThumb.vue';
import Observer from '../components/Observer.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const gridCols = route.query.columns ?? '3'

// tokens, sorted
const tokens = computed(() => {
  const tokens = store.state.nfts
  if (!tokens) return undefined
  if (isSortNewest.value) {
    tokens.reverse()
  }
  return tokens
})

// page size
const pageSize = ref(0)
const pageSizeStep = ref(5)
// demo
const demoTokens = Array(100)

// sort
const isSortNewest = ref(true)

function toggleSort () {
  isSortNewest.value = !isSortNewest.value
  emit('sortChange')
  // replace rt so CableImage refreshes observer
  router.replace(isSortNewest.value ? {} : { query: { sort: 'oldest' }})
  // reset page size
  pageSize.value = pageSizeStep.value
}
</script>