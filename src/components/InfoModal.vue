<template>
<Modal maxWidth="51em" class="text-center">
  <header class="mt-2">
    <h1>DoAW</h1>
    (dead or alive wallet)<br><br>
    by JOAN HEEMSKERK<br><br>
    ~ presented by <a href="https://folia.app" class="underline" target="_blank">folia</a> ~<br>
  </header>
  <ol class="list-decimal border p-2 text-left my-6 pl-12">
    <li>PAUSE the engine on your favorite <span v-for="(char, i) in ('SEEDPHRASE').split('')" :key="i" :style="{color: stringToHexColor(Array(6).fill(char).join())}">{{ char }}</span></li>
    <li>CONNECT your ethereum wallet</li>
    <li>MINT a DoAW (and win)</li>
  </ol>
  <footer class="flex justify-evenly mb-2">
    <a :href="$store.getters.etherscanLink()" class="underline" target="_blank" rel="noopener noreferrer">CONTRACT</a>
    <a :href="$store.getters.openSeaLink({})" class="underline" target="_blank" rel="noopener noreferrer">OPENSEA</a>
  </footer>
</Modal>
</template>

<script setup>
import Modal from './Modal.vue';
import stringToHexColor from '../utils/stringToHexColor';

</script>