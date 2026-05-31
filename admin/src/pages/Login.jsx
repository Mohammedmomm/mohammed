import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { login as apiLogin } from '../api/auth'
import useAuthStore from '../store/authStore'

const schema = z.object({
  username: z.string().min(1, 'مطلوب'),
  password: z.string().min(1, 'مطلوب'),
})

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await apiLogin(data.username, data.password)
      const { token, admin } = res.data
      login(token, admin)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Demo fallback: accept admin/admin
      if (data.username === 'admin' && data.password === 'admin') {
        login('demo-token-123', { username: 'admin', role: 'super_admin', id: 1 })
        navigate('/dashboard', { replace: true })
        return
      }
      toast.error(t('auth.wrongCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0F1C2E' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              background: '#1E6FBF',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #1E6FBF, #F47920)' }} />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1E6FBF, #F47920)' }}
              >
                <Zap size={28} fill="white" stroke="none" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{t('auth.welcomeMessage')}</h1>
              <p className="text-lg font-bold mt-0.5" style={{ color: '#1E6FBF' }}>
                {t('auth.syriacablezone')}
              </p>
              <p className="text-sm text-gray-500 mt-1">{t('auth.enterCredentials')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.username')}
                </label>
                <input
                  {...register('username')}
                  type="text"
                  autoComplete="username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="admin"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all pe-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ backgroundColor: '#1E6FBF' }}
              >
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Syria Cable Zone © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
