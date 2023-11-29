<template>
  <article>
    <section class="flex flex-col h-screen">
      <!-- fills remaining screen after bottom bars -->
      <div class="relative flex-1">
        <iframe :src="iframeUrl" class="absolute overlay" />
      </div>

      <!-- bottom bar -->
      <div class="flex px-3 py-2.5 gap-2.5">
        <div class="flex-1 grid grid-cols-3 gap-2">
          <div class="flex flex-col justify-evenly">
            <div class="w-full flex justify-between">
              <div>MINTED:</div>
              <div>235/500</div>
            </div>
            <div class="max-w-full flex justify-between">
              <div class="pr-[0.5em]">PRICE:</div>
              <div class="flex-1 min-w-0 truncate text-right">0.1234567890123456789</div>
              <div>ETH</div>
            </div>
          </div>
          <button class="flex items-center justify-center border">
            CONNECT
          </button>
          <button class="flex items-center justify-center border">
            MINT
          </button>
        </div>

        <button class="w-12 h-12 flex-shrink-0 flex items-center justify-center border">
          ?
        </button>

        <button class="w-12 h-12 flex-shrink-0 flex items-center justify-center border">
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.04492 0.300781V2.01465H7.33203V3.72852H5.61816V5.44238H3.9043H2.19043H0.476562V7.15625V8.87012V10.584H2.19043H3.9043H5.61816V12.2979H7.33105V14.0117H9.04492H9.0459V15.7256H10.7598V14.0117H10.7588V12.2979V10.584V8.87012V7.15625V5.44238V3.72852V2.01465V0.300781H9.04492Z" fill="black"/>
            <rect x="17.6143" y="7.15674" width="1.71289" height="5.1416" transform="rotate(90 17.6143 7.15674)" fill="black"/>
          </svg>
        </button>
      </div>
      <div class="h-10"></div>
    </section>

    <!-- sticky-top grid nav bar -->
    <nav id="index" class="-mt-10 sticky top-0 left-0 w-full h-10 flex items-center gap-[0.5em] leading-snug px-3 bg-neutral-400">
      <div>LIST:</div>
      <router-link to="/" class="px-[0.75em] pt-px">ALL</router-link>
      <router-link to="/yours" class="px-[0.75em] pt-px">YOURS</router-link>
      <router-link to="/owners" class="px-[0.75em] pt-px">OWNERS</router-link>
    </nav>
    
    <!-- grid pages -->
    <router-view></router-view>
  </article>
</template>

<script setup>
const iframeUrl = import.meta.env.VITE_SERVER
</script>

<style scoped>
nav .router-link-exact-active{
  background:black; color:white;
}
</style>