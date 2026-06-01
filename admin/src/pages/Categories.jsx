import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, FolderOpen, Folder, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import axiosInstance from '../api/axiosInstance'

const CategoryRow = ({ cat, depth = 0, onEdit, onDelete, onAddChild }) => {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = cat.children?.length > 0
  const { t } = useTranslation()

  return (
    <div>
      <div
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group transition-colors"
        style={{ paddingInlineStart: `${12 + depth * 24}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 flex-shrink-0"
        >
          {hasChildren ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-3" />}
        </button>
        <span className="text-lg flex-shrink-0">{cat.icon || (hasChildren ? <FolderOpen size={16} /> : <Folder size={16} />)}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 text-sm">{cat.name_ar}</p>
          <p className="text-xs text-gray-400">{cat.name_en}</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:block">
          {cat.product_count} {t('categories.productCount')}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAddChild(cat)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"><Plus size={13} /></button>
          <button onClick={() => onEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={13} /></button>
          <button onClick={() => onDelete(cat)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={13} /></button>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {cat.children.map((child) => (
            <CategoryRow key={child.id} cat={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryForm = ({ cat, parent, onSave, onClose }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name_ar: cat?.name_ar || '',
    name_en: cat?.name_en || '',
    icon: cat?.icon || '',
    sort_order: cat?.sort_order || 1,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en) { toast.error('الاسم مطلوب'); return }
    setSaving(true)
    try {
      if (cat?.id) {
        await axiosInstance.put(`/categories/${cat.id}`, form)
        toast.success(t('categories.editCategory') + ' ✓')
      } else {
        await axiosInstance.post('/categories', { ...form, parent_id: parent?.id || null })
        toast.success(t('categories.addCategory') + ' ✓')
      }
      onSave()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {cat ? t('categories.editCategory') : (parent ? t('categories.addChildCategory') : t('categories.addRootCategory'))}
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
      </div>
      {parent && (
        <div className="bg-blue-50 rounded-lg p-2 mb-4 text-xs text-blue-700">
          {t('categories.parentCategory')}: {parent.name_ar}
        </div>
      )}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">{t('categories.nameAr')} *</label>
          <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" dir="rtl" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">{t('categories.nameEn')} *</label>
          <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" dir="ltr" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('categories.icon')}</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="🔌" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.sortOrder')}</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50" style={{ backgroundColor: '#1E6FBF' }}>
            <Save size={14} />
            {saving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

const Categories = () => {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [parentForNew, setParentForNew] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/categories/tree')
      setCategories(res.data.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل التصنيفات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleEdit = (cat) => { setEditing(cat); setParentForNew(null); setShowForm(true) }
  const handleAddChild = (parent) => { setEditing(null); setParentForNew(parent); setShowForm(true) }
  const handleAddRoot = () => { setEditing(null); setParentForNew(null); setShowForm(true) }

  const handleSave = () => {
    setShowForm(false)
    fetchCategories()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/categories/${deleteTarget.id}`)
      toast.success(t('categories.deleteCategory') + ' ✓')
      fetchCategories()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل الحذف')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={t('nav.categories')}
        actions={[{ label: t('categories.addRootCategory'), icon: Plus, onClick: handleAddRoot }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl card-shadow p-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FolderOpen size={16} style={{ color: '#1E6FBF' }} />
              {t('categories.categoryTree')}
            </h3>
            <span className="text-xs text-gray-400">{categories.length} تصنيف رئيسي</span>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">{t('categories.noCategories')}</div>
          ) : (
            categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onAddChild={handleAddChild}
              />
            ))
          )}
        </div>

        {showForm && (
          <div className="lg:col-span-1">
            <CategoryForm
              cat={editing}
              parent={parentForNew}
              onSave={handleSave}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('categories.deleteCategory')}
        message={t('categories.confirmDelete')}
        confirmText={t('common.delete')}
        danger
      />
    </div>
  )
}

export default Categories
