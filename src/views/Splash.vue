<template>
  <article class="fixed overlay flex flex-col">
    <iframe ref="iframeEl" :src="iframeUrl" class="flex-1 w-full" />

    <div class="pt-1.5 sm:pt-2 pb-2 sm:flex flex-wrap items-center text-center sm:text-left justify-between px-2.5" style="font-size:0.875em">
      <div class="max-w-full">JOAN HEEMSKERK</div>
      <div class="pr-0.5">DEAD OR ALIVE WALLET</div>
      <div class="relative">
        <div class="invisible">JOAN HEEMSKERK</div>
        <div class="absolute overlay text-center sm:text-right">
          <a href="https://folia.app/works/joan-heemskerk-doaw" target="_blank" class="underline">12.12.2023</a>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const iframeUrl = import.meta.env.VITE_SERVER
</script>