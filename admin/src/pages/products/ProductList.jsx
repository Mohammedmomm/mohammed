import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Search, LayoutGrid, List, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import DataTable from '../../components/shared/DataTable'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import axiosInstance from '../../api/axiosInstance'

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
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [available, setAvailable] = useState('')
  const [selected, setSelected] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const limit = 24

  // Fetch filter options
  useEffect(() => {
    axiosInstance.get('/categories/flat').then((res) => setCategories(res.data.data || [])).catch(() => {})
    axiosInstance.get('/brands?limit=100').then((res) => {
      const d = res.data?.data
      setBrands(Array.isArray(d) ? d : (d?.data || []))
    }).catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/products', {
        params: { page, limit, category, brand, available, q: search },
      })
      const d = res.data.data
      if (d && d.items) {
        setProducts(d.items)
        setTotal(d.pagination?.total || d.items.length)
      } else {
        setProducts(d || [])
        setTotal((d || []).length)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }, [page, limit, category, brand, available, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/products/${deleteId}`)
      toast.success(t('products.productDeleted'))
      fetchProducts()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل الحذف')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleToggleAvailable = async (id) => {
    try {
      await axiosInstance.patch(`/products/${id}/toggle-available`)
      fetchProducts()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تغيير الحالة')
    }
  }

  const handleToggleFeatured = async (id) => {
    try {
      await axiosInstance.patch(`/products/${id}/toggle-featured`)
      fetchProducts()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تغيير الحالة')
    }
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
        subtitle={`${total} ${t('common.total')}`}
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder={t('products.searchProducts')}
            className="w-full ps-8 pe-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white"
        >
          <option value="">{t('products.filterByCategory')}</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
        </select>
        <select
          value={brand}
          onChange={(e) => { setBrand(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white"
        >
          <option value="">{t('products.filterByBrand')}</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name_en}</option>)}
        </select>
        <select
          value={available}
          onChange={(e) => { setAvailable(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white"
        >
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
          data={products}
          loading={loading}
          selectable
          onSelectionChange={setSelected}
          pagination={{ page, limit, total }}
          onPageChange={setPage}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-400">{t('common.loading')}</div>
          ) : products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 card-shadow hover:shadow-md transition-shadow">
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">IMG</span>}
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
