<template>
  <UPopover mode="hover" :openDelay="400">
    <slot />
    
    <template #panel>
      <div class="p-2 text-xs">
        {{ text }}
      </div>
    </template>
  </UPopover>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true }
})
</script>