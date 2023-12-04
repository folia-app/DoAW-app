<template>
  <section>
    <template v-if="!leaderboard">
      <p class="animate-blink">
        loading...
      </p>
    </template>
    <template v-else>
      <ul>
        <li v-for="(row, index) in leaderboard" :key="row.address" class="flex">
          <router-link :to="'/' + row.address" class="flex-1 min-w-0 flex px-2.5 py-2 gap-3 mouse:hover:bg-[rgba(255,255,255,0.1)]">
            <div>#{{ index+1 }}</div>
            <div class="flex-1 min-w-0 truncate">
              <Addr :address="row.address" />
            </div>
            <div>{{ row.count }}</div>
          </router-link>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup>
  import { computed } from 'vue';
  import store from '../store';
  import Addr from '../components/Addr.vue';

  const leaderboard = computed(() => {
    let owners = store.state.nfts?.map(token => token.owner)
    if (owners) {
      owners = [...new Set(owners)] // de-dupe
      owners = owners.map(owner => ({
        address: owner,
        count: store.state.nfts.filter(token => token.owner === owner).length
      }))
      owners = owners.sort((a, b) => a.count - b.count)
    }
    return owners
  })
</script>