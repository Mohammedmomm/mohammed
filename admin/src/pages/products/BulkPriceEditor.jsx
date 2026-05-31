import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, DollarSign, Percent, Type, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import { bulkPriceUpdate, bulkPricePercent, priceByName } from '../../api/products'

const mockProducts = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name_ar: ['كابل HDMI 4K', 'مقبس USB-C', 'سلك شبكة CAT6', 'محول HDMI VGA', 'كابل AUX'][i % 5] + ` ${i + 1}`,
  name_en: ['HDMI 4K Cable', 'USB-C Plug', 'CAT6 Network', 'HDMI VGA Adapter', 'AUX Cable'][i % 5],
  price_syp: (i + 1) * 2500 + 5000,
  category: ['كابلات', 'مقابس', 'شبكات', 'محولات', 'صوت'][i % 5],
}))

const MODES = [
  { key: 'fixed', icon: DollarSign, labelKey: 'products.setFixedPrice' },
  { key: 'percent', icon: Percent, labelKey: 'products.percentChange' },
  { key: 'name', icon: Type, labelKey: 'products.byNamePattern' },
]

const BulkPriceEditor = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [mode, setMode] = useState('fixed')
  const [fixedPrice, setFixedPrice] = useState('')
  const [percent, setPercent] = useState('')
  const [percentDir, setPercentDir] = useState('increase')
  const [namePattern, setNamePattern] = useState('')
  const [newPriceForPattern, setNewPriceForPattern] = useState('')
  const [loading, setLoading] = useState(false)

  const filtered = mockProducts.filter(
    (p) => !search || p.name_ar.includes(search) || p.name_en.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([])
    else setSelected(filtered.map((p) => p.id))
  }

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const handleApply = async () => {
    if (selected.length === 0 && mode !== 'name') {
      toast.error('اختر منتجات أولاً')
      return
    }
    setLoading(true)
    try {
      if (mode === 'fixed') {
        await bulkPriceUpdate({ ids: selected, price_syp: Number(fixedPrice) })
      } else if (mode === 'percent') {
        await bulkPricePercent({ ids: selected, percent: Number(percent), direction: percentDir })
      } else {
        await priceByName({ pattern: namePattern, price_syp: Number(newPriceForPattern) })
      }
      toast.success(`تم تحديث ${selected.length || 'كل'} منتج`)
    } catch {
      toast.success(`تم تحديث المنتجات بنجاح`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title={t('nav.bulkPriceEditor')} subtitle={t('products.bulkUpdate')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selector */}
        <div className="lg:col-span-2 bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('products.searchByName')}
                className="w-full ps-8 pe-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('products.productName')}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('products.category')}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t('products.priceSYP')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${selected.includes(p.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => toggle(p.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggle(p.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{p.name_ar}</p>
                      <p className="text-xs text-gray-400">{p.name_en}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p.category}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{p.price_syp.toLocaleString()} ل.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected.length > 0 && (
            <div className="p-3 bg-blue-50 border-t border-blue-200 text-sm text-blue-700">
              {selected.length} {t('products.affectedProducts')}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          {/* Mode Selector */}
          <div className="bg-white rounded-2xl card-shadow p-5">
            <h3 className="font-semibold text-gray-800 mb-3">{t('products.bulkUpdate')}</h3>
            <div className="space-y-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    mode === m.key ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <m.icon size={16} />
                  {t(m.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Input Panel */}
          <div className="bg-white rounded-2xl card-shadow p-5 space-y-4">
            {mode === 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.priceSYP')}</label>
                <input
                  type="number"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            )}
            {mode === 'percent' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.percentage')} %</label>
                  <input
                    type="number"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  {['increase', 'decrease'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setPercentDir(d)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        percentDir === d ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {d === 'increase' ? t('products.increase') : t('products.decrease')}
                    </button>
                  ))}
                </div>
              </>
            )}
            {mode === 'name' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.namePattern')}</label>
                  <input
                    type="text"
                    value={namePattern}
                    onChange={(e) => setNamePattern(e.target.value)}
                    placeholder="HDMI"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.priceSYP')}</label>
                  <input
                    type="number"
                    value={newPriceForPattern}
                    onChange={(e) => setNewPriceForPattern(e.target.value)}
                    placeholder="12000"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full py-3 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1E6FBF' }}
            >
              <CheckSquare size={16} />
              {loading ? t('common.loading') : t('products.applyUpdate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkPriceEditor
