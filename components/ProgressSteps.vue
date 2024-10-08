<template>
  <div class="flex flex-row gap-4 items-center">
    <div v-for="(_, i) in Array(steps)"
      class="h-2 w-2 border border-gray-900"
      :class="{ 'bg-gray-900': i <= currentStep }" >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: { type: Number, default: 3 },
  currentStep: { type: Number, default: 0 }
})
</script>

<style lang="postcss" scoped>
</style>
