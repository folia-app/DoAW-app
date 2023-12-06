<template>
  <section class="tokens-list relative z-10">
    <template v-if="!props.tokens">
      <p class="animate-blink px-2.5 py-2">
        loading...
      </p>
    </template>
    <template v-else-if="!tokens.length">
      <p class="px-2.5 py-2">no DoAW's</p>
    </template>
    <template v-else>
      <ul class="bg-black text-white">
        <template v-for="n in 1">
          <li v-for="token in props.tokens" :key="token.tokenId + '_' + n" class="flex">
            <!-- token link -->
            <router-link :to="'/tokens/' + token.tokenId" class="flex-1 min-w-0 flex px-2.5 py-2.5 min-h-9 items-start gap-3 mouse:hover:bg-[rgba(255,255,255,0.1)]">
              <div>#{{ ('000' + (token.index)).slice(-3) }}</div>
              <div class="uppercase">
                <span v-for="word in mneuomonic(token.tokenId).split(' ')" :key="word" class="inline-block pr-3" :style="{'color': stringToHexColor(word)}">
                  {{ word }}
                </span>
              </div>
            </router-link>
            <!-- profile link -->
            <!-- <a :href="$store.getters.openSeaLink({account: token.owner})" target="_blank" rel="noopener noreferrer" class="block pl-3 pr-2.5 h-10 items-center underline mouse:hover:bg-[rgba(255,255,255,0.1)]">
              <Addr :address="token.owner" />
            </a> -->
            <router-link :to="'/' + token.owner.toLowerCase()" class="pl-3 pr-2.5 py-2.5 flex min-h-9 items-start underline mouse:hover:bg-[rgba(255,255,255,0.1)] max-w-[33%]">
              <div class="truncate min-w-0">
                <Addr :address="token.owner" />
              </div>
            </router-link>
          </li>
        </template>
      </ul>
    </template>
  </section>
</template>

<script setup>
  import { utils } from 'ethers';
  import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
  import hexToBytes from '../utils/hexToBytes';
  import Addr from '../components/Addr.vue';
  import stringToHexColor from '../utils/stringToHexColor.js';

  const props = defineProps(['tokens'])
  
  function mneuomonic (tokenId) {
    const entropy = tokenIdtoEntropy(tokenId)
    return utils.entropyToMnemonic(hexToBytes(entropy))
  }
</script>