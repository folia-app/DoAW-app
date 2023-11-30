<template>
  <li>
    <router-link :to="'/tokens/' + props.token.tokenId" class="block aspect-doaw-thumb relative bg-grau-200">
      <NFTThumbIframe :id="props.token.tokenId" />
    </router-link>
  </li>
</template>

<script setup>
  import NFTThumbIframe from './NFTThumbIframe.vue';
  const props = defineProps(['token'])
</script>