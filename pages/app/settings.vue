<template>
  <div>
    <TheTopNav back
      @back="goBack" />

    <div class="page">
      <div>
        <h2 class="mb-2">What's Relevant to Me?</h2>
        
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
            Make it clear what's relevant to you, so when people reach out,
            they can make sure to align with your goals. 
          </div>

          <div v-else v-for="(r, i) in relevancies"
            :key="i"
            class="mt-2 flex flex-row items-center gap-2">
            <UIcon name="i-heroicons-bars-3" class="drag-handle" />
            <!-- <UInput v-model="r.emoji" /> -->
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
      </div>

      <div class="divider" />

      <div>
        <h2 class="mb-2">Public Link</h2>

        <div class="flex flex-row items-start gap-4">
          <UFormGroup :error>
            <UInput v-model="publicLink"
            class="w-[25em]"
            @update:model-value="showSaveButton = true" />
          </UFormGroup>
          <UButton v-if="showSaveButton"
            @click="savePublicLink">
            Save
          </UButton>
        </div>

        <div class="mt-2 text-sm text-gray-400 italic">
          Changing this will cause existing links to break. If you change this, please update your LinkedIn or wherever you post this link
        </div>
      </div>

      <!-- TODO set public link on this page -->

      <!-- TODO remind ppl install the chrome extension -->
      
      <!-- TODO preview public page button -->

      <!-- TODO Fix google login with a re-auth button -->
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import lodash_pkg from 'lodash';
const { cloneDeep, debounce } = lodash_pkg;

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const { apiBaseUrl } = useAppConfig()

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value()
])

async function goBack() {
  await navigateTo('/app/dashboard')
}

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
  debounceRelevanciesUpdate()
}

async function saveRelevancies() {
  await usersStore.updateUser({ relevancies })
}

const debounceRelevanciesUpdate = debounce(saveRelevancies, 3000, { leading: false, trailing: true })
watch(relevancies, () => {
  debounceRelevanciesUpdate()
})

const router = useRouter()
router.beforeEach(async () => {
  await debounceRelevanciesUpdate.flush()
})

const publicLink = ref(me.publicLink)
const error = ref(false)
const showSaveButton = ref(false)
async function savePublicLink () {
  const result = await usersStore.updatePublicLink({ publicLink })
  if (result.error) {
    error.value = result.error
  } else {
    showSaveButton.value = false;
    error.value = false
  }
}
</script>

<style lang="postcss" scoped>
.page {
  @apply mx-[8rem] px-16 py-8 border rounded-md border-gray-200 min-h-[calc(100vh-100px)]
    flex flex-col gap-8;

  /* this should probably be done with psuedo elements, but ain't nobody got time for that */
  .divider {
    @apply w-[80%] mx-auto border-b border-gray-200;
  }
}


.relevancies-grid {
  @apply grid gap-x-4 gap-y-2 items-center max-w-[600px];
  grid-template-columns: auto auto 1fr auto;
}
</style>
