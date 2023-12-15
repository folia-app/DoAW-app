<template>
  <section class="tokens-list relative z-10">
    <p class="m-2.5 mb-0 border border-neutral-400 p-3 leading-relaxed"><a href="https://opensea.io/collection/shadoaw" target="_blank" rel="noopener noreferer" class="underline">shaDoAWs</a> cast into the wallets exposed by the first mints of DoAW. DoAWs play through the sub-infinite number of private keys derived from their seed phrase, but each shaDoAW plays through all possible seed phrases of wallets on Ethereum (2^160). <span class="text-neutral-500">shaDoAWs in <span class="text-whiteff">white</span> have been looted from their DoAW wallet <template v-if="tokens?.length">({{tokens.filter(t => t.captured).length}}/{{tokens.length}})</template></span></p>
    <template v-if="!tokens">
      <p class="animate-blink px-2.5 py-2">
        loading...
      </p>
    </template>
    <template v-else-if="!tokens.length">
      <p class="px-2.5 py-2">no DoAW's</p>
    </template>
    <template v-else>
      <ul class="bg-black text-white">
        <li v-for="(token, index) in tokens" :key="token.tokenId + '_' + index" class="flex flex-wrap md:flex-nowrap min-h-9 justify-between" :class="{'text-neutral-500': !token.captured}">
          <!-- token link -->
          <a :href="store.getters.openSeaLink({tokenId: token.tokenId})" target="_blank" rel="noopener noreferrer" class="text-neutral-500ff order-1 pl-2.5 pr-1.5 py-2.5 block">
            #{{ token.tokenId }}
          </a>

          <a :href="store.getters.openSeaLink({tokenId: token.tokenId, contractAddress})" target="_blank" rel="noopener noreferrer" class="order-3 block w-full md:w-auto px-2.5 pb-2.5 md:py-2.5 md:flex-1 text-left mouse:hover:bg-[rgba(255,255,255,0.1)]">
            <div class="md:flex gap-3">
              <div class="inline md:block whitespace-nowrap">
                shaDoAW of
              </div>
              <div class="inline md:block">
                <span v-for="word in mneuomonic(token.tokenId).split(' ')" :key="word" class="uppercase inline-block pr-3" :style="{'colorff': stringToHexColor(word)}">
                  {{ word }}
                </span>
              </div>
            </div>
          </a>
          <!-- profile link -->
          <!-- <a :href="$store.getters.openSeaLink({account: token.owner})" target="_blank" rel="noopener noreferrer" class="block pl-3 pr-2.5 h-10 items-center underline mouse:hover:bg-[rgba(255,255,255,0.1)]">
            <Addr :address="token.owner" />
          </a> -->
          <a :href="token.captured ? store.getters.openSeaLink({account: token.owner}) : store.getters.etherscanLink({address: token.owner}) + '#nfttransfers'" target="_blank" rel="noopener noreferrer" class="order-2 md:order-last flex-1 md:flex-none pl-3 pr-2.5 py-2.5 flex min-w-0 md:min-h-9 items-start justify-end text-right mouse:hover:bg-[rgba(255,255,255,0.1)]">
            <template v-if="token.captured">
              <Addr :address="token.owner" class="underline" />
            </template>
            <span v-else>
              {{store.getters.addrShort(token.owner)}}
            </span>
          </a>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import SortButton from '../components/SortButton.vue';
import { useRoute } from 'vue-router';
// import TokensList from '../components/TokensList.vue';
import { useHead } from '@unhead/vue'
import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
import hexToBytes from '../utils/hexToBytes';
import { utils } from 'ethers';
import stringToHexColor from '../utils/stringToHexColor.js';
import Addr from '../components/Addr.vue';
import Contracts from 'nft-contracts';

const route = useRoute()
const contractAddress = Contracts.shaDoAW.networks[import.meta.env.VITE_NETWORK_NAME].address

const tokens = computed(() => {
  let tokens = store.state.shadoaws?.slice(0)
  if (tokens) {
    if (route.query.sort !== 'oldest') {
      tokens.reverse()
    }
  }
  return tokens
})

function mneuomonic (shadoawtokenId) {
  console.log(store.state.nfts[shadoawtokenId - 1])
  const tokenId = store.state.nfts && store.state.nfts[shadoawtokenId - 1]?.tokenId
  if (!tokenId) return '...'
  const entropy = tokenIdtoEntropy(tokenId)
  return utils.entropyToMnemonic(hexToBytes(entropy))
}

useHead(store.getters.meta({
  title: 'shaDoAWs',
}))
</script>