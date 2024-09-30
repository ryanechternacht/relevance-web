<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia' 

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

if (me) {
  await navigateTo('/app/dashboard')
} else {
  await navigateTo('/login')
}
</script>
