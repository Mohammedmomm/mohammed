import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'

const categoriesFlat = [
  { id: 1, name_ar: 'كابلات', name_en: 'Cables' },
  { id: 11, name_ar: 'كابلات HDMI', name_en: 'HDMI Cables' },
  { id: 12, name_ar: 'كابلات USB', name_en: 'USB Cables' },
  { id: 2, name_ar: 'مقابس وقطع توصيل', name_en: 'Connectors' },
  { id: 3, name_ar: 'أجهزة صوتية', name_en: 'Audio Devices' },
  { id: 4, name_ar: 'محولات', name_en: 'Adapters' },
]

const initialTemplates = {
  1: [
    { id: 1, name_ar: 'الطول', name_en: 'Length', type: 'number', unit: 'متر', required: true },
    { id: 2, name_ar: 'اللون', name_en: 'Color', type: 'text', unit: '', required: false },
    { id: 3, name_ar: 'النوع', name_en: 'Type', type: 'select', unit: '', required: true },
  ],
  11: [
    { id: 1, name_ar: 'الدقة', name_en: 'Resolution', type: 'select', unit: '', required: true },
    { id: 2, name_ar: 'الإصدار', name_en: 'Version', type: 'select', unit: '', required: true },
    { id: 3, name_ar: 'الطول', name_en: 'Length', type: 'number', unit: 'م', required: true },
    { id: 4, name_ar: 'مضفر', name_en: 'Braided', type: 'boolean', unit: '', required: false },
  ],
  12: [
    { id: 1, name_ar: 'نوع USB', name_en: 'USB Type', type: 'select', unit: '', required: true },
    { id: 2, name_ar: 'سرعة النقل', name_en: 'Transfer Speed', type: 'select', unit: '', required: true },
    { id: 3, name_ar: 'الطول', name_en: 'Length', type: 'number', unit: 'سم', required: true },
  ],
}

const FIELD_TYPES = ['text', 'number', 'select', 'boolean']

const SpecTemplates = () => {
  const { t } = useTranslation()
  const [selectedCat, setSelectedCat] = useState(null)
  const [templates, setTemplates] = useState(initialTemplates)
  const [saving, setSaving] = useState(false)

  const fields = selectedCat ? (templates[selectedCat] || []) : []

  const addField = () => {
    if (!selectedCat) return
    const newField = { id: Date.now(), name_ar: '', name_en: '', type: 'text', unit: '', required: false }
    setTemplates((prev) => ({ ...prev, [selectedCat]: [...(prev[selectedCat] || []), newField] }))
  }

  const updateField = (id, key, val) => {
    setTemplates((prev) => ({
      ...prev,
      [selectedCat]: prev[selectedCat].map((f) => (f.id === id ? { ...f, [key]: val } : f)),
    }))
  }

  const deleteField = (id) => {
    setTemplates((prev) => ({
      ...prev,
      [selectedCat]: prev[selectedCat].filter((f) => f.id !== id),
    }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success(t('specTemplates.templateSaved'))
    }, 500)
  }

  const cat = categoriesFlat.find((c) => c.id === selectedCat)

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title={t('nav.specTemplates')} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category List */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{t('specTemplates.selectCategory')}</h3>
          </div>
          <div className="py-2">
            {categoriesFlat.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-start ${
                  selectedCat === cat.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex-1">{cat.name_ar}</span>
                <span className="text-xs text-gray-400">{(templates[cat.id] || []).length} حقل</span>
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
                      {fields.map((field) => (
                        <tr key={field.id} className="border-b border-gray-50">
                          <td className="px-4 py-2.5">
                            <GripVertical size={14} className="text-gray-300 cursor-grab" />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              value={field.name_ar}
                              onChange={(e) => updateField(field.id, 'name_ar', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                              dir="rtl"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              value={field.name_en}
                              onChange={(e) => updateField(field.id, 'name_en', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                              dir="ltr"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, 'type', e.target.value)}
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
                              onChange={(e) => updateField(field.id, 'unit', e.target.value)}
                              className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                              placeholder="م"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                              className="rounded border-gray-300 text-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <button onClick={() => deleteField(field.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
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
