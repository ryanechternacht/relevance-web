import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  const usersStore = useUsersStore()
  const { isUserLoggedIn } = storeToRefs(usersStore)

  const [isLoggedIn] = await Promise.all([
    isUserLoggedIn.value(),
  ])
  
  if (!isLoggedIn) {
    return navigateTo('/login')
  }
})
