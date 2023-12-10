<template>
  <button class="h-10 px-2.5 flex items-center justify-end pointer-events-auto" @click="toggleSort">
    {{ isSortNewest ? 'NEW' : 'OLD' }}<span class="hidden md:inline">EST</span>↓
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const isSortNewest = ref(route.query.sort !== 'oldest')

function toggleSort () {
  isSortNewest.value = !isSortNewest.value
  // emit('sortChange')
  // replace rt so CableImage refreshes observer
  router.replace(isSortNewest.value ? {} : { query: { sort: 'oldest' }})
  // reset page size
  // pageSize.value = pageSizeStep.value
}
</script>