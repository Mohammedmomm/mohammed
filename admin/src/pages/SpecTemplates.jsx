import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Save, GripVertical, X } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import axiosInstance from '../api/axiosInstance'

const FIELD_TYPES = ['text', 'number', 'select', 'boolean']

const SpecTemplates = () => {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [fields, setFields] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingFields, setLoadingFields] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCats(true)
      try {
        const res = await axiosInstance.get('/categories/flat')
        setCategories(res.data.data || [])
      } catch (err) {
        toast.error(err?.response?.data?.message || 'فشل تحميل التصنيفات')
      } finally {
        setLoadingCats(false)
      }
    }
    fetchCats()
  }, [])

  const fetchTemplates = useCallback(async (catId) => {
    if (!catId) return
    setLoadingFields(true)
    try {
      const res = await axiosInstance.get(`/specifications/templates/category/${catId}`)
      const rows = res.data.data || []
      // parse options if stored as JSON string
      setFields(rows.map((r) => ({
        ...r,
        options: Array.isArray(r.options)
          ? r.options
          : r.options ? JSON.parse(r.options) : [],
      })))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل القوالب')
      setFields([])
    } finally {
      setLoadingFields(false)
    }
  }, [])

  const handleSelectCat = (catId) => {
    setSelectedCat(catId)
    fetchTemplates(catId)
  }

  const addField = () => {
    setFields((prev) => [...prev, {
      _new: true,
      _tempId: Date.now(),
      label_ar: '',
      label_en: '',
      field_type: 'text',
      unit: '',
      is_required: false,
      options: [],
    }])
  }

  const updateField = (identifier, key, val) => {
    setFields((prev) => prev.map((f) => {
      const id = f._tempId || f.id
      return id === identifier ? { ...f, [key]: val } : f
    }))
  }

  const addOption = (identifier) => {
    setFields((prev) => prev.map((f) => {
      const id = f._tempId || f.id
      if (id !== identifier) return f
      return { ...f, options: [...(f.options || []), ''] }
    }))
  }

  const updateOption = (identifier, idx, val) => {
    setFields((prev) => prev.map((f) => {
      const id = f._tempId || f.id
      if (id !== identifier) return f
      const opts = [...(f.options || [])]
      opts[idx] = val
      return { ...f, options: opts }
    }))
  }

  const removeOption = (identifier, idx) => {
    setFields((prev) => prev.map((f) => {
      const id = f._tempId || f.id
      if (id !== identifier) return f
      const opts = (f.options || []).filter((_, i) => i !== idx)
      return { ...f, options: opts }
    }))
  }

  const deleteField = async (f) => {
    if (f._new) {
      setFields((prev) => prev.filter((x) => (x._tempId || x.id) !== (f._tempId || f.id)))
      return
    }
    try {
      await axiosInstance.delete(`/specifications/templates/${f.id}`)
      setFields((prev) => prev.filter((x) => x.id !== f.id))
      toast.success('تم الحذف')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل الحذف')
    }
  }

  const generateFieldKey = (labelEn) =>
    labelEn.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')

  const handleSave = async () => {
    if (!selectedCat) return
    setSaving(true)
    try {
      for (const f of fields) {
        const fieldKey = f.field_key || generateFieldKey(f.label_en) || `field_${Date.now()}`
        const payload = {
          field_key: fieldKey,
          label_ar: f.label_ar,
          label_en: f.label_en,
          field_type: f.field_type,
          unit: f.unit || '',
          is_required: f.is_required,
          options: f.field_type === 'select' ? (f.options || []).filter(Boolean) : null,
          sort_order: f.sort_order || 0,
        }
        if (f._new) {
          await axiosInstance.post(`/specifications/templates/category/${selectedCat}`, payload)
        } else {
          await axiosInstance.put(`/specifications/templates/${f.id}`, payload)
        }
      }
      toast.success(t('specTemplates.templateSaved'))
      fetchTemplates(selectedCat)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const cat = categories.find((c) => c.id === selectedCat)

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title={t('nav.specTemplates')} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category List */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{t('specTemplates.selectCategory')}</h3>
          </div>
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {loadingCats ? (
              <div className="text-center py-6 text-gray-400 text-sm">{t('common.loading')}</div>
            ) : categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCat(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-start ${
                  selectedCat === c.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex-1">{c.name_ar}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fields Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl card-shadow overflow-hidden">
          {!selectedCat ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              {t('specTemplates.selectCategory')}
            </div>
          ) : loadingFields ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">{t('common.loading')}</div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-800">{cat?.name_ar}</h3>
                  <p className="text-xs text-gray-400">{cat?.name_en} — {fields.length} حقل</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addField}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Plus size={14} />
                    {t('specTemplates.addField')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-sm disabled:opacity-50"
                    style={{ backgroundColor: '#1E6FBF' }}
                  >
                    <Save size={14} />
                    {saving ? t('common.loading') : t('common.save')}
                  </button>
                </div>
              </div>

              {fields.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {t('specTemplates.noTemplateForCategory')}
                  <br />
                  <button onClick={addField} className="mt-2 text-blue-500 hover:underline text-xs">{t('specTemplates.addField')}</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                        <th className="px-4 py-3 w-8" />
                        <th className="px-4 py-3 text-start font-medium">{t('specTemplates.fieldNameAr')}</th>
                        <th className="px-4 py-3 text-start font-medium">{t('specTemplates.fieldNameEn')}</th>
                        <th className="px-4 py-3 text-start font-medium">{t('specTemplates.fieldType')}</th>
                        <th className="px-4 py-3 text-start font-medium">{t('specTemplates.fieldUnit')}</th>
                        <th className="px-4 py-3 text-start font-medium">{t('specTemplates.isRequired')}</th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field) => {
                        const identifier = field._tempId || field.id
                        return (
                          <>
                            <tr key={identifier} className="border-b border-gray-50">
                              <td className="px-4 py-2.5">
                                <GripVertical size={14} className="text-gray-300 cursor-grab" />
                              </td>
                              <td className="px-4 py-2.5">
                                <input
                                  value={field.label_ar}
                                  onChange={(e) => updateField(identifier, 'label_ar', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                                  dir="rtl"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <input
                                  value={field.label_en}
                                  onChange={(e) => updateField(identifier, 'label_en', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                                  dir="ltr"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <select
                                  value={field.field_type}
                                  onChange={(e) => updateField(identifier, 'field_type', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                                >
                                  {FIELD_TYPES.map((ft) => (
                                    <option key={ft} value={ft}>{t(`specTemplates.fieldTypes.${ft}`)}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-2.5">
                                <input
                                  value={field.unit}
                                  onChange={(e) => updateField(identifier, 'unit', e.target.value)}
                                  className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                                  placeholder="م"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={field.is_required}
                                  onChange={(e) => updateField(identifier, 'is_required', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-500"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <button onClick={() => deleteField(field)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                            {field.field_type === 'select' && (
                              <tr key={`${identifier}-opts`} className="border-b border-gray-100 bg-blue-50/30">
                                <td />
                                <td colSpan={6} className="px-4 py-2">
                                  <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-xs text-gray-500 font-medium">الخيارات:</span>
                                    {(field.options || []).map((opt, idx) => (
                                      <div key={idx} className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1">
                                        <input
                                          value={opt}
                                          onChange={(e) => updateOption(identifier, idx, e.target.value)}
                                          className="text-xs outline-none w-20"
                                          placeholder="خيار..."
                                          dir="auto"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeOption(identifier, idx)}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <X size={10} />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => addOption(identifier)}
                                      className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 border border-dashed border-blue-300 rounded-lg px-2 py-1"
                                    >
                                      <Plus size={10} />
                                      إضافة خيار
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpecTemplates
