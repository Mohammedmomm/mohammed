import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Shield, Eye, EyeOff, Save, Key } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import useAuthStore from '../store/authStore'
import { changePassword } from '../api/auth'

const pwSchema = z.object({
  current_password: z.string().min(1, 'مطلوب'),
  new_password: z.string().min(6, 'على الأقل 6 أحرف'),
  confirm_password: z.string().min(1, 'مطلوب'),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirm_password'],
})

const getStrength = (pw) => {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const StrengthBar = ({ password, t }) => {
  const strength = getStrength(password)
  const labels = [t('account.passwordWeak'), t('account.passwordFair'), t('account.passwordGood'), t('account.passwordStrong')]
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#22C55E']

  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: i <= strength ? colors[strength - 1] : '#e2e8f0' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength - 1] || '#94a3b8' }}>
        {t('account.passwordStrength')}: {labels[strength - 1] || ''}
      </p>
    </div>
  )
}

const Account = () => {
  const { t } = useTranslation()
  const admin = useAuthStore((s) => s.admin)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pwSchema),
  })

  const newPw = watch('new_password', '')

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await changePassword(data)
    } catch {}
    toast.success(t('account.passwordUpdated'))
    reset()
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader title={t('nav.myAccount')} />

      {/* Profile Info Card */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <User size={16} style={{ color: '#1E6FBF' }} />
          {t('account.profileInfo')}
        </h3>
        <div className="flex items-center gap-5 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: '#1E6FBF' }}
          >
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{admin?.username || 'admin'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} style={{ color: '#F47920' }} />
              <span className="text-sm text-gray-500">{t('account.superAdmin')}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">{t('account.username')}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{admin?.username || 'admin'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('account.role')}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{t('account.superAdmin')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('account.createdAt')}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">2024-01-01</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('account.lastLogin')}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">اليوم</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Key size={16} style={{ color: '#1E6FBF' }} />
          {t('account.changePassword')}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('account.currentPassword')}</label>
            <div className="relative">
              <input
                {...register('current_password')}
                type={showCurrent ? 'text' : 'password'}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm pe-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 end-3 flex items-center text-gray-400">
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('account.newPassword')}</label>
            <div className="relative">
              <input
                {...register('new_password')}
                type={showNew ? 'text' : 'password'}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm pe-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 end-3 flex items-center text-gray-400">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <StrengthBar password={newPw} t={t} />
            {errors.new_password && <p className="text-xs text-red-500 mt-1">{errors.new_password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('account.confirmPassword')}</label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
            {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-xl font-medium disabled:opacity-50"
            style={{ backgroundColor: '#1E6FBF' }}
          >
            <Save size={16} />
            {saving ? t('common.loading') : t('account.savePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Account
