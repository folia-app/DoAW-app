<template>
  <!-- child route as overlay (token view) -->
  <router-view />
  <nav class="sticky top-0 right-0 -mt-10 pointer-events-none flex justify-end pointer-events-none">
    <div class="h-10 px-2.5 flex items-center justify-end pointer-events-auto">
      RECENT
    </div>
  </nav>
  <ul class="grid grid-cols-6 gap-px bg-black">
    <li v-for="n in 20">
      <router-link to="/tokens/test">
        <img src="/static/demo/gifTest.gif" alt="" class="block">
      </router-link>
    </li>
  </ul>
</template>