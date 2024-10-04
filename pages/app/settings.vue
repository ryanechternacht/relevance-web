<template>
  <div>
    <TheTopNav header="Settings">
      <template #action-items>
        <div>
          <UButton variant="outline"
            icon="i-heroicons-arrow-left"
            to="/app/dashboard">
            Back to Dashboard
          </UButton>
        </div>
      </template>
    </TheTopNav>

    <div class="mx-12 p-4 border rounded-md border-gray-200 min-h-[calc(100vh-100px)]">
      <div>
        <h2>What's Relevant to Me?</h2>
        <div class="relevancies-grid">
          <template v-for="(r, i) in relevancies">
            <UIcon name="i-heroicons-bars-3" />
            <UInput v-model="r.emoji" />
            <MultilineInput v-model="r.description"
              override-style
              class="" />
            <UButton icon="i-heroicons-trash"
              variant="outline"
              @click="removeRow(i)" />
          </template>
          <div class="col-span-3">
            <UButton
              variant="outline"
              @click="addCategory">
              Add Category
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const { apiBaseUrl } = useAppConfig()

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value()
])

const relevancies = ref([{
  emoji: "🍕",
  description: "Partners looking to explore integrations",
  ordering: 0,
}, {
  emoji: "🍔",
  description: "People looking to help the AKC Rescure",
  ordering: 1,
}])

function removeRow(i) {
  relevancies.value.splice(i, 1)
}

function addCategory() {
  relevancies.value.push({
    emoji: "",
    description: "",
    ordering: relevancies.value.count,
  })
}
</script>

<style lang="postcss" scoped>
.relevancies-grid {
  @apply grid gap-x-4 gap-y-2 items-center;
  grid-template-columns: auto auto 1fr auto;
}
</style>
