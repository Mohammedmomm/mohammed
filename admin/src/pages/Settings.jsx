import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, Globe, Phone, Share2, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import axiosInstance from '../api/axiosInstance'

const TABS = [
  { key: 'general', icon: Globe },
  { key: 'contact', icon: Phone },
  { key: 'socialMedia', icon: Share2 },
  { key: 'display', icon: Monitor },
]

// Field must be outside Settings to avoid re-mount on every keystroke
const Field = ({ label, name, value, onChange, placeholder = '', dir = 'ltr' }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
      dir={dir}
    />
  </div>
)

const Settings = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/settings')
      const raw = res.data.data || []
      const obj = Array.isArray(raw)
        ? raw.reduce((acc, row) => { acc[row.key] = row.value; return acc }, {})
        : raw
      setForm(obj)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const sanitized = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)])
      )
      await axiosInstance.put('/settings', { settings: sanitized })
      toast.success(t('settings.settingsSaved'))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <PageHeader title={t('nav.settings')} />
        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={t('nav.settings')}
        actions={[{
          label: saving ? t('common.loading') : t('settings.saveAll'),
          icon: Save,
          onClick: handleSave,
        }]}
      />

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                tab === key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} />
              {t(`settings.${key}`)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label={t('settings.siteNameAr')} name="site_name_ar" value={form.site_name_ar} onChange={update} dir="rtl" />
              <Field label={t('settings.siteNameEn')} name="site_name_en" value={form.site_name_en} onChange={update} dir="ltr" />
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.siteDescriptionAr')}</label>
                <textarea value={form.site_description_ar || ''} onChange={(e) => update('site_description_ar', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" dir="rtl" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.siteDescriptionEn')}</label>
                <textarea value={form.site_description_en || ''} onChange={(e) => update('site_description_en', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" dir="ltr" />
              </div>
              <Field label={t('settings.logoUpload')} name="logo_url" value={form.logo_url} onChange={update} placeholder="https://..." dir="ltr" />
            </div>
          )}

          {tab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* keys match backend PUBLIC_KEYS */}
              <Field label={t('settings.whatsapp')} name="whatsapp_number" value={form.whatsapp_number} onChange={update} placeholder="+963912345678" dir="ltr" />
              <Field label={t('settings.phone')} name="phone_number" value={form.phone_number} onChange={update} placeholder="+963112345678" dir="ltr" />
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.address')} (عربي)</label>
                <textarea value={form.address_ar || ''} onChange={(e) => update('address_ar', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" dir="rtl" placeholder="دمشق، سوريا" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.address')} (English)</label>
                <textarea value={form.address_en || ''} onChange={(e) => update('address_en', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" dir="ltr" placeholder="Damascus, Syria" />
              </div>
            </div>
          )}

          {tab === 'socialMedia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label={t('settings.facebook')} name="facebook_url" value={form.facebook_url} onChange={update} placeholder="https://facebook.com/..." dir="ltr" />
              <Field label={t('settings.instagram')} name="instagram_url" value={form.instagram_url} onChange={update} placeholder="https://instagram.com/..." dir="ltr" />
              <Field label={t('settings.telegram')} name="telegram_url" value={form.telegram_url} onChange={update} placeholder="https://t.me/..." dir="ltr" />
              <Field label={t('settings.twitterX')} name="twitter_url" value={form.twitter_url} onChange={update} placeholder="https://x.com/..." dir="ltr" />
              <Field label={t('settings.youtube')} name="youtube_url" value={form.youtube_url} onChange={update} placeholder="https://youtube.com/..." dir="ltr" />
            </div>
          )}

          {tab === 'display' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-lg">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.productsPerPage')}</label>
                <input
                  type="number"
                  value={form.products_per_page || 20}
                  onChange={(e) => update('products_per_page', e.target.value)}
                  min={4}
                  max={100}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('settings.similarProductsCount')}</label>
                <input
                  type="number"
                  value={form.similar_products_count || 6}
                  onChange={(e) => update('similar_products_count', e.target.value)}
                  min={2}
                  max={20}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium disabled:opacity-50"
          style={{ backgroundColor: '#1E6FBF' }}
        >
          <Save size={16} />
          {saving ? t('common.loading') : t('settings.saveAll')}
        </button>
      </div>
    </div>
  )
}

export default Settings
