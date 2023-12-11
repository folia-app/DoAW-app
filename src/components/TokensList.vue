<template>
  <section class="tokens-list relative z-10">
    <template v-if="!props.tokens">
      <p class="animate-blink px-2.5 py-2">
        loading...
      </p>
    </template>
    <template v-else-if="!props.tokens.length">
      <p class="px-2.5 py-2">no DoAW's</p>
    </template>
    <template v-else>
      <Observer @visible="onListVisible" :threshold="0.01">
        <button v-if="tokens && (tokens.length < props.tokens.length)" class="sticky top-16 md:top-10 bg-black border text-white text-center py-2 w-full" @click="updateTokenList">
          LOAD {{ props.tokens.length - tokens.length }} NEW DoAWs
        </button>
        <ul class="bg-black text-white">
          <li v-for="(token, index) in renderedTokens" :key="token.tokenId + '_' + index" class="flex flex-wrap md:flex-nowrap min-h-9 justify-between">
            <!-- token link -->
            <div v-if="demoAmount">{{ index }}</div>
            <router-link :to="'/tokens/' + token.tokenId" class="order-1 pl-2.5 pr-1.5 py-2.5 block">
              #{{ token.index }}
            </router-link>

            <router-link :to="'/tokens/' + token.tokenId" class="order-3 px-2.5 pb-2.5 md:py-2.5 md:flex-1 text-left mouse:hover:bg-[rgba(255,255,255,0.1)]">
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
            <router-link :to="'/' + token.owner.toLowerCase()" class="order-2 md:order-last flex-1 md:flex-none pl-3 pr-2.5 py-2.5 flex min-w-0 md:min-h-9 items-start justify-end text-right underline mouse:hover:bg-[rgba(255,255,255,0.1)] max-w-[24em]">
              <div class="truncate min-w-0">
                <Addr :address="token.owner" />
              </div>
            </router-link>
          </li>
        </ul>
      </Observer>

      <!-- lazy page loader -->
      <Observer v-if="tokens && pageSize < tokens.length" class="min-h-[25vh] flex items-end justify-start animate-blink" :threshold="0.01" @visible="pageSize = pageSize + pageSizeStep">
        <div class="sticky bottom-2.5 left-0 px-2.5">loading...</div>
      </Observer>
    </template>
  </section>
</template>

<script setup>
  import { utils } from 'ethers';
  import tokenIdtoEntropy from '../utils/tokenIdtoEntropy';
  import hexToBytes from '../utils/hexToBytes';
  import Addr from '../components/Addr.vue';
  import stringToHexColor from '../utils/stringToHexColor.js';
  import { useRoute } from 'vue-router';
  import { computed, ref, watch } from 'vue';
  import Observer from './Observer.vue';

  const props = defineProps(['tokens'])
  const route = useRoute()
  const demoAmount = route.query.count

  // load in a static amount
  const tokens = ref(props.tokens)

  // const tokens = computed(() => {
  //   let tokens = loadedTokens.value
  //   if (demoAmount && tokens.length) {
  //     tokens = Array(Number(demoAmount)).fill(tokens[0])
  //   }
  //   return tokens
  // })
  
  function mneuomonic (tokenId) {
    const entropy = tokenIdtoEntropy(tokenId)
    return utils.entropyToMnemonic(hexToBytes(entropy))
  }

  const isListVisible = ref(false)

  function onListVisible () {
    isListVisible.value = true
    if (!tokens.value?.length) {
      // update static amount if was empty
      tokens.value = props.tokens //.slice(-94) // demo
    }
  }

  function updateTokenList () {
    tokens.value = props.tokens
  }

  // page size
  const initilaPageSize = 32
  const pageSizeStep = ref(32)
  const pageSize = ref(initilaPageSize)

  const renderedTokens = computed(() => tokens.value?.slice(0, pageSize.value))

  watch(() => route.query.sort, (to, from) => {
    setTimeout(() => {
      pageSize.value = initilaPageSize
      tokens.value = props.tokens
    }, 100)
  })
</script>