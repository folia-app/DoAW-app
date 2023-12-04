<template>
  <nav class="sticky z-20 top-0 right-0 -mt-10 flex justify-end pointer-events-none">
    <SortButton />
  </nav>
  <section class="relative z-10">
    <template v-if="!tokens">
      <p class="animate-blink">
        loading...
      </p>
    </template>
    <template v-else>
      <ul class="bg-black text-white">
        <template v-for="n in 1">
          <li v-for="token in tokens" :key="token.tokenId + '_' + n" class="flex">
            <router-link :to="'/tokens/' + token.tokenId" class="flex-1 min-w-0 flex px-2.5 py-2 gap-3 mouse:hover:bg-[rgba(255,255,255,0.1)]">
              <div>#{{ ('000' + (token.index)).slice(-3) }}</div>
              <div class="uppercase">
                <span v-for="word in mneuomonic(token.tokenId).split(' ')" :key="word" class="inline-block pr-3" :style="{'color': stringToHexColor(word)}">
                  {{ word }}
                </span>
              </div>
            </router-link>
            <a :href="$store.getters.openSeaLink({account: token.owner})" target="_blank" rel="noopener noreferrer" class="block pl-3 pr-2.5 py-2 underline mouse:hover:bg-[rgba(255,255,255,0.1)]">
              <Addr :address="token.owner" />
            </a>
          </li>
        </template>
      </ul>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import { utils } from 'ethers';
import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
import hexToBytes from '../utils/hexToBytes';
import Addr from '../components/Addr.vue';
import stringToHexColor from '../utils/stringToHexColor.js';
import SortButton from '../components/SortButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const tokens = computed(() => {
  let tokens = store.state.nfts.slice(0)
  if (tokens) {
    if (route.query.sort !== 'oldest') {
      tokens.reverse()
    }
  }
  return tokens
})

function mneuomonic (tokenId) {
  const entropy = tokenIdtoEntropy(tokenId)
  return utils.entropyToMnemonic(hexToBytes(entropy))
}
</script>