import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Search, LayoutGrid, List, Edit2, Trash2, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import DataTable from '../../components/shared/DataTable'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import { deleteProduct, toggleAvailable, toggleFeatured } from '../../api/products'

const mockProducts = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name_ar: ['كابل HDMI 4K سامسونج', 'مقبس USB-C', 'سلك شبكة CAT6', 'محول HDMI VGA', 'كابل AUX 3.5mm', 'جهاز بث WiFi'][i % 6],
  name_en: ['Samsung 4K HDMI Cable', 'USB-C Plug', 'CAT6 Network Cable', 'HDMI VGA Adapter', 'AUX Cable 3.5mm', 'WiFi Adapter'][i % 6],
  category: { name_ar: ['كابلات', 'مقابس', 'شبكات', 'محولات', 'صوت', 'شبكات'][i % 6] },
  brand: { name_en: ['Samsung', 'Anker', 'TP-Link', 'Ugreen', 'JBL', 'TP-Link'][i % 6] },
  price_syp: (i + 1) * 2500 + 5000,
  price_usd: ((i + 1) * 2500 + 5000) / 13500,
  is_available: i % 3 !== 2,
  is_featured: i % 5 === 0,
  image_url: null,
}))

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
  >
    <span
      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'end-0.5' : 'start-0.5'}`}
    />
  </button>
)

const ProductList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name_ar.includes(search) ||
      p.name_en.toLowerCase().includes(search.toLowerCase())
  )

  const paginated = filtered.slice((page - 1) * limit, page * limit)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteProduct(deleteId)
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success(t('products.productDeleted'))
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success(t('products.productDeleted'))
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleToggleAvailable = async (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    )
    try {
      await toggleAvailable(id)
    } catch {}
  }

  const handleToggleFeatured = async (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    )
    try {
      await toggleFeatured(id)
    } catch {}
  }

  const columns = [
    {
      key: 'image_url',
      title: t('common.image'),
      width: 60,
      render: (val) => (
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {val ? <img src={val} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">IMG</span>}
        </div>
      ),
    },
    {
      key: 'name_ar',
      title: t('products.productNameAr'),
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-800">{val}</p>
          <p className="text-xs text-gray-400">{row.name_en}</p>
        </div>
      ),
    },
    {
      key: 'category',
      title: t('products.category'),
      render: (val) => <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{val?.name_ar}</span>,
    },
    {
      key: 'price_syp',
      title: t('products.priceSYP'),
      render: (val) => <span className="font-semibold text-gray-700">{val?.toLocaleString()} ل.س</span>,
    },
    {
      key: 'price_usd',
      title: t('products.priceUSD'),
      render: (val) => <span className="text-gray-500">${val?.toFixed(2)}</span>,
    },
    {
      key: 'is_available',
      title: t('common.available'),
      render: (val, row) => <Toggle checked={val} onChange={() => handleToggleAvailable(row.id)} />,
    },
    {
      key: 'is_featured',
      title: t('common.featured'),
      render: (val, row) => <Toggle checked={val} onChange={() => handleToggleFeatured(row.id)} />,
    },
    {
      key: 'actions',
      title: t('common.actions'),
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/products/edit/${row.id}`)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title={t('nav.allProducts')}
        subtitle={`${filtered.length} ${t('common.total')}`}
        actions={[
          {
            label: t('nav.addProduct'),
            icon: Plus,
            onClick: () => navigate('/products/add'),
          },
        ]}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 card-shadow flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('products.searchProducts')}
            className="w-full ps-8 pe-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
          <option value="">{t('products.filterByCategory')}</option>
          <option>كابلات</option>
          <option>مقابس</option>
          <option>شبكات</option>
        </select>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
          <option value="">{t('products.filterByBrand')}</option>
          <option>Samsung</option>
          <option>Anker</option>
          <option>TP-Link</option>
        </select>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
          <option value="">{t('products.filterByStatus')}</option>
          <option value="1">{t('common.available')}</option>
          <option value="0">{t('common.inactive')}</option>
        </select>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-medium text-blue-700">
            {selected.length} {t('products.selectedItems')}
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              {t('products.bulkDelete')}
            </button>
            <button className="px-3 py-1.5 text-sm bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              {t('products.bulkToggleAvailable')}
            </button>
            <button
              onClick={() => navigate('/products/bulk-price')}
              className="px-3 py-1.5 text-sm text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#1E6FBF' }}
            >
              {t('products.bulkUpdatePrice')}
            </button>
          </div>
        </div>
      )}

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={paginated}
          loading={loading}
          selectable
          onSelectionChange={setSelected}
          pagination={{ page, limit, total: filtered.length }}
          onPageChange={setPage}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paginated.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 card-shadow hover:shadow-md transition-shadow">
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-400 text-xs">IMG</span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{p.name_ar}</p>
              <p className="text-xs text-gray-400 truncate mb-2">{p.name_en}</p>
              <p className="text-sm font-bold" style={{ color: '#1E6FBF' }}>{p.price_syp?.toLocaleString()} ل.س</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {p.is_available ? t('common.available') : t('common.inactive')}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => navigate(`/products/edit/${p.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={12} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('products.confirmDelete')}
        message={t('products.confirmDeleteMessage')}
        confirmText={t('common.delete')}
        danger
      />
    </div>
  )
}

export default ProductList
