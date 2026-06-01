import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, RefreshCw, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import LineChartComp from '../components/charts/LineChartComp'
import axiosInstance from '../api/axiosInstance'

const ExchangeRate = () => {
  const { t } = useTranslation()
  const [currentRate, setCurrentRate] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRate, setNewRate] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rateRes, historyRes] = await Promise.all([
        axiosInstance.get('/exchange-rate/current'),
        axiosInstance.get('/exchange-rate/history'),
      ])
      setCurrentRate(rateRes.data.data?.usd_to_syp ?? rateRes.data.data?.rate ?? null)
      setHistory(historyRes.data.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل سعر الصرف')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpdate = async () => {
    const rate = Number(newRate)
    if (!rate || rate <= 0) { toast.error('أدخل سعراً صحيحاً'); return }
    setSaving(true)
    try {
      await axiosInstance.post('/exchange-rate', { usd_to_syp: rate, note })
      toast.success(t('exchangeRate.rateUpdated'))
      setNewRate('')
      setNote('')
      fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحديث سعر الصرف')
    } finally {
      setSaving(false)
    }
  }

  const chartData = history.map((h) => ({
    date: h.date ? h.date.slice(0, 10) : '',
    rate: h.usd_to_syp ?? h.rate,
  })).reverse()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t('nav.exchangeRate')} />

      {/* Big Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          className="md:col-span-1 rounded-2xl p-8 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #1E6FBF, #155A99)' }}
        >
          <DollarSign size={40} className="mx-auto mb-3 opacity-80" />
          <p className="text-sm opacity-80 mb-1">{t('exchangeRate.currentRate')}</p>
          <p className="text-4xl font-bold mb-2">{loading ? '...' : currentRate?.toLocaleString()}</p>
          <p className="text-sm opacity-70">{t('exchangeRate.perDollar')}</p>
          <div className="mt-4 bg-white/20 rounded-xl py-2 px-3 text-xs">
            {t('exchangeRate.lastUpdated')}: {history[0]?.date?.slice(0, 10) || '—'}
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2 bg-white rounded-2xl card-shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <RefreshCw size={16} style={{ color: '#1E6FBF' }} />
            {t('exchangeRate.updateRate')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('exchangeRate.newRate')}</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="13500"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold"
                />
                <span className="text-gray-500 text-sm whitespace-nowrap">ل.س / دولار</span>
              </div>
              {newRate && Number(newRate) > 0 && currentRate && (
                <p className="text-xs text-gray-400 mt-1">
                  التغيير: {Number(newRate) > currentRate ? '+' : ''}{((Number(newRate) - currentRate) / currentRate * 100).toFixed(2)}%
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('exchangeRate.note')} ({t('common.optional')})</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="سبب التغيير..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <button
              onClick={handleUpdate}
              disabled={saving || !newRate}
              className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-medium w-full disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#1E6FBF' }}
            >
              <RefreshCw size={16} className={saving ? 'animate-spin' : ''} />
              {saving ? t('common.loading') : t('exchangeRate.updateRate')}
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl card-shadow p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#F47920' }} />
            {t('exchangeRate.rateChart')}
          </h3>
          <LineChartComp
            data={chartData}
            xKey="date"
            lines={[{ key: 'rate', name: t('exchangeRate.usdToSyp'), color: '#1E6FBF' }]}
          />
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{t('exchangeRate.rateHistory')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                <th className="px-5 py-3 text-start font-medium">{t('exchangeRate.date')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('exchangeRate.currentRate')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('exchangeRate.changedBy')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('exchangeRate.note')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400">{t('common.loading')}</td></tr>
              ) : history.map((h, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-600">{h.date?.slice(0, 10)}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{(h.usd_to_syp ?? h.rate)?.toLocaleString()} ل.س</td>
                  <td className="px-5 py-3 text-gray-500">{h.changed_by}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{h.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExchangeRate
