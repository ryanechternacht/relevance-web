<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UModals />
  </div>
</template>

<script setup>
useHead({ 
  link: [{
    rel: "icon",
    href: "/logo.svg",
  }]
})
</script>
