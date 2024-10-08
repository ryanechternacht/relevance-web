<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia' 

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

if (!me) {
  await navigateTo('/login')
}

console.log('me', me)

switch(me.onboardingStep) {
  case 'new': 
    await navigateTo('/app/onboarding/public-link')
    break
  case 'relevancies': 
    await navigateTo('/app/onboarding/relevancies')
    break
  case 'linkedin': 
    await navigateTo('/app/onboarding/linkedin')
    break
  case 'done': 
    await navigateTo('/app/dashboard')
    break
  default: 
    await navigateTo('/app/dashboard')
    break
}
</script>
