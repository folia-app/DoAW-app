<template>
  <div class="fixed z-30 overlay flex px-4 py-12 overflow-scroll">
    <!-- card -->
    <div ref="cardEl" tabindex="0" class="m-auto w-full p-4 flex flex-col relative z-10 bg-black text-white border ffshadow-hard text-center" :style="{maxWidth: props.maxWidth}">
      <slot></slot>
      <!-- X close button -->
      <button class="absolute top-0 right-0 flex items-center justify-center pl-1 h-10 w-9 mouse:hover:bg-neutral-800" aria-label="Close Mint Dialog" @click="emit('close')">X</button>
    </div>

    <!-- close btn overlay -->
    <button class="absolute overlay cursor-default" @click="emit('close')" aria-label="Close Mint Dialog"></button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps(['maxWidth'])
const emit = defineEmits(['close'])

let prevActiveEl = document.activeElement
const cardEl = ref()
onMounted(() => cardEl.value.focus())
onUnmounted(() => prevActiveEl.focus())
</script>