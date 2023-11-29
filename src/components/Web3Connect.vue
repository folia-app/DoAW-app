<template>
<div class="header">
  <div>
    {{ network || "no-network" }}: <a :href="$store.getters.etherscanLink()">{{ $store.getters.contractAddress }}</a>
  </div>
  <div>minted: {{  nfts?.length }} / {{ $store.state.maxSupply }}</div>
  <div>price: {{ price ? $store.getters.weiToETH(price) : '??' }} ETH</div>
  <div :class="{'font-bold': now < datePremint}">now: {{ new Date(now) }}</div>
  <div :class="{'font-bold': now >= datePremint && now < datePublic}">premint: {{ new Date(datePremint) }}</div>
  <div :class="{'font-bold': now >= datePublic}">public: {{ new Date(datePublic) }}</div>
  <button @click="connect">connect</button>
  <button @click="disconnect">disconnect</button>
  <div>{{ address || "no-address" }}</div>
  <div>{{ canWrite ? "canWrite" : "!canWrite" }}</div>
  <div>
    <button @click="mint(1)">mint</button>
    <button @click="getBalance">getNFTBalance</button>
    balance: {{ balance }}
  </div>
  <template v-if="error">
    <p class="text-red-500">{{ error }}</p>
  </template>
  <br>
  <div class="clear">
    <button @click="changePage(-1)">prev</button>
    <button @click="changePage(1)">next</button>
    {{ page }} / {{ Math.ceil(nfts?.length / perPage) }}
  </div>
  <div class="nft" v-for="nft in paginatedNFTs" :key="nft.tokenId">
    <hr>
    <div class="stats">tokenId: {{ nft.tokenId }}</div>
    <div class="stats">owner: {{  nft.owner }}</div>
    <div class="clear"></div>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Web3Connect',
  data() {
    return {
      page: 1,
      perPage: 4,
      balance: undefined,
      now: new Date().getTime(),
      error: undefined
    }
  },
  props: {},
  computed: {
    paginatedNFTs() {
      return this.nfts?.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    },
    ...mapState(['network', 'nfts', 'baseURI', 'price', 'datePremint', 'datePublic']),
    ...mapGetters(['addrShort', 'ethToWei', 'weiToETH', 'address', 'canWrite'])
  },
  methods: {
    changePage(amount) {
      this.page += amount
      if (this.page < 1) this.page = 1
      if (this.page > Math.ceil(this.nfts?.length / this.perPage)) this.page = Math.ceil(this.nfts?.length / this.perPage)
    },
    ...mapActions(['connect', 'disconnect']),
    async getBalance () {
      this.balance = await this.$store.dispatch('getNFTBalance')
    },
    async mint (amount = 1) {
      try {
        this.error = undefined
        await this.$store.dispatch('mint', amount)
      } catch (e) {
        this.error = e.reason ?? e.message ?? e
      }
    }
  },
  created () {
    this.$store.dispatch('getPrice')
    this.$store.dispatch('getMaxSupply')
    this.$store.dispatch('getDatePremint')
    this.$store.dispatch('getDatePublic')
  },
  mounted () {
    const count = () => {
      this.now = new Date()
      setTimeout(count, 1000)
    }
    count()
  }
}
</script>
<style scoped>
  button{
    border: 1px solid currentColor;
  }
  img {
    width: 323px;
    float:left;
    margin: 10px;
  }
  .stats {
    margin: 10px;
  }
  .clear {
    clear: both;
  }
  .nft {
    max-width: 620px;
    width: 50%;
    display: inline-block;
  }
</style>