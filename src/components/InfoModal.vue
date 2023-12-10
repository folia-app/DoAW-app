<template>
<Modal maxWidth="51em" class="text-center">
  <header class="mt-2">
    <h1 style="font-size:1.75em">DoAW</h1>
    <br>
    <!-- Dead or Alive Wallet<br><br> -->
    by JOAN HEEMSKERK<br><br>
    - presented by <a href="https://folia.app" class="underline" target="_blank">folia</a> -<br>
  </header>
  <ol class="list-decimal border p-2 text-left my-6 pl-12">
    <li>click START to generate <span v-for="(char, i) in ('SEEDPHRASES').split('')" :key="i" :style="{colorff: stringToHexColor(Array(6).fill(char).join())}">{{ char }}</span></li>
    <li>PAUSE on your favorite</li>
    <li>CONNECT your ethereum wallet</li>
    <li>MINT a DoAW</li>
  </ol>
  <footer class="flex justify-evenly mb-2">
    <a :href="$store.getters.etherscanLink({})" class="underline" target="_blank" rel="noopener noreferrer">CONTRACT</a>
    <a :href="$store.getters.openSeaLink({})" class="underline" target="_blank" rel="noopener noreferrer">OPENSEA</a>
  </footer>
</Modal>
</template>

<script setup>
import Modal from './Modal.vue';
import stringToHexColor from '../utils/stringToHexColor';

</script>