<template>
  <TheTopNav is-onboarding />
  <div class="mt-20 w-full flex flex-col items-center gap-8">
    <ProgressSteps current-step="1" />

    <div>Let's create your relevance page:</div>

    <VueDraggable
      v-model="relevancies"
      ghost-class="ghost"
      :animation="200"
      :scroll="false"
      group="relevancies"
      handle=".drag-handle"
    >
      <div v-if="!relevancies.length"
        class="text-gray-400 italic">
        Add items to share what’s relevant to you. This is what people will see before they reach out to you.
      </div>

      <div v-else v-for="(r, i) in relevancies"
        :key="i"
        class="mt-2 flex flex-row items-center gap-2">
        <UIcon name="i-heroicons-bars-3" class="drag-handle" />
        <UPopover v-model:open="r.open" 
          :popper="{ placement: 'bottom-start' }">
          <UButton color="white">
            {{ r.emoji }}
          </UButton>

          <template #panel>
            <NuxtEmojiPicker :native="true"
              disable-skin-tones
              @select="(e) => onSelectEmoji(e, i)" />
          </template>
        </UPopover>
        <MultilineInput v-model="r.description"
          class="w-[24rem]"
          @update:model-value="debounceRelevanciesUpdate" />
        <UButton icon="i-heroicons-trash"
          size="sm"
          variant="ghost"
          @click="removeRow(i)" />
      </div>
    </VueDraggable>
    <UButton class="mt-2"
      variant="outline"
      @click="addCategory">
      Add Category
    </UButton>

  <UButton @click="next">
    Next
  </UButton>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import lodash_pkg from 'lodash'
const { cloneDeep } = lodash_pkg

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const relevancies = ref(cloneDeep(me.relevancies))

function removeRow(i) {
  relevancies.value.splice(i, 1)
  debounceRelevanciesUpdate()
}

function addCategory() {
  relevancies.value.push({
    emoji: "🍕",
    description: "",
  })
}

function onSelectEmoji (newEmoji, i) {
  relevancies.value[i].emoji = newEmoji.i
  relevancies.value[i].open = false
}

async function next() {
  await usersStore.updateUser({ onboardingStep: 'linkedin', relevancies })
  await navigateTo('/app/onboarding/linkedin')
}
</script>

<style lang="postcss" scoped>
</style>
