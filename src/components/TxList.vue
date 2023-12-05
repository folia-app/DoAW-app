<template>
  <ul v-if="txs?.length" class="tx-list flex flex-col gap-1.5 normal-case text-black">
    <!-- txs... -->
    <template v-for="n in 1">
      <li v-for="tx in txs" :key="tx.txHash + n" >
        <TxRow v-if="tx.status == 'success'" class="bg-green-200">
          successful {{ tx.name}}!! <button v-if="tx.name === 'mint'" class="underline" @click="viewMint(tx)">view</button>
        </TxRow>
        <TxRow v-else-if="tx.status == 'pending'" class="bg-amber-100">
          <span class="animate-blink">pending {{ tx.name }}...</span> <a :href="etherscanLink(tx)" target="_blank" rel="noopener noreferrer" class="underline">tx</a>
        </TxRow>
        <TxRow v-else-if="tx.status == 'error'" class="bg-red-300">
          failed {{ tx.name}}! <a :href="etherscanLink(tx)" target="_blank" rel="noopener noreferrer" class="underline">tx</a>
        </TxRow>
        <TxRow v-else>
          {{tx.status}} {{ tx.name }}: <a :href="etherscanLink(tx)" target="_blank" rel="noopener noreferrer" class="underline">tx</a>
        </TxRow>
      </li>
    </template>
  </ul>
</template>

<script setup>
import TxRow from './TxRow.vue';
import store from '@/store'

const { txs } = defineProps(['txs'])
const etherscanLink = ({ txHash }) => store.getters.etherscanLink(txHash)

const emit = defineEmits(['viewMint'])
const viewMint = ({txHash}) => {
  store.commit('REMOVE_TX', txHash)  
  emit('viewMint')
}
</script>