<template>
  <article class="fixed overlay flex flex-col">
    <iframe ref="iframeEl" :src="iframeUrl" class="flex-1 w-full" />

    <div class="py-2 flex flex-wrap items-center justify-between px-2.5">
      <div class="max-w-full">JOAN HEEMSKERK: DoAW</div>
      <div><a href="https://folia.app/works/joan-heemskerk-doaw" target="_blank" class="underline">12.12.2023</a></div>
    </div>
  </article>
</template>

<script setup>
const iframeUrl = import.meta.env.VITE_SERVER
</script>