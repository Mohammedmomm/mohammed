import useAuthStore from '../store/authStore'

const useAuth = () => {
  const { token, admin, isAuthenticated, login, logout } = useAuthStore()
  return { token, admin, isAuthenticated, login, logout }
}

export default useAuth
