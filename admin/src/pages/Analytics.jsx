import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, TrendingUp, TrendingDown, Eye, Users, Clock, Percent } from 'lucide-react'
import StatCard from '../components/shared/StatCard'
import AreaChartComp from '../components/charts/AreaChartComp'
import BarChartComp from '../components/charts/BarChartComp'
import DonutChartComp from '../components/charts/DonutChartComp'
import PageHeader from '../components/shared/PageHeader'

const visitorsPerDay = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}/5`,
  visitors: Math.floor(Math.random() * 400 + 80),
  pageViews: Math.floor(Math.random() * 800 + 200),
}))

const byHour = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  visitors: Math.floor(Math.random() * 120 + (h >= 9 && h <= 22 ? 40 : 5)),
}))

const citiesData = [
  { city: 'دمشق', visitors: 3420 },
  { city: 'حلب', visitors: 2180 },
  { city: 'حمص', visitors: 1340 },
  { city: 'اللاذقية', visitors: 980 },
  { city: 'طرطوس', visitors: 720 },
  { city: 'حماة', visitors: 680 },
  { city: 'دير الزور', visitors: 450 },
  { city: 'الرقة', visitors: 320 },
]

const productInterest = [
  { rank: 1, name_ar: 'كابل HDMI 4K سامسونج', name_en: 'Samsung 4K HDMI Cable', category: 'كابلات', total: 1842, today: 64, week: 320, trend: 12 },
  { rank: 2, name_ar: 'مقبس USB-C سريع الشحن', name_en: 'Fast Charge USB-C Plug', category: 'مقابس', total: 1654, today: 48, week: 290, trend: 8 },
  { rank: 3, name_ar: 'سلك شبكة CAT6 100m', name_en: 'CAT6 Network Cable 100m', category: 'شبكات', total: 1230, today: 35, week: 210, trend: 5 },
  { rank: 4, name_ar: 'محول HDMI إلى VGA', name_en: 'HDMI to VGA Adapter', category: 'محولات', total: 980, today: 28, week: 180, trend: 3 },
  { rank: 5, name_ar: 'كابل صوت AUX 3.5mm', name_en: 'AUX 3.5mm Audio Cable', category: 'صوت', total: 870, today: 22, week: 140, trend: -2 },
  { rank: 6, name_ar: 'جهاز بث USB WiFi', name_en: 'USB WiFi Adapter', category: 'شبكات', total: 740, today: 18, week: 120, trend: 7 },
]

const adPerformance = [
  { title: 'عرض كابلات HDMI 4K', position: 'hero', impressions: 8420, clicks: 354, ctr: 4.2, active: true },
  { title: 'تخفيضات أجهزة صوتية', position: 'sidebar', impressions: 7030, clicks: 218, ctr: 3.1, active: true },
  { title: 'وصل جديد: كابلات فايبر', position: 'popup', impressions: 3360, clicks: 195, ctr: 5.8, active: true },
  { title: 'عروض صيف 2024', position: 'footer_banner', impressions: 5200, clicks: 104, ctr: 2.0, active: false },
]

const searchTerms = [
  { rank: 1, term: 'كابل HDMI', count: 842, found: true },
  { rank: 2, term: 'USB-C', count: 620, found: true },
  { rank: 3, term: 'كابل شبكة CAT6', count: 481, found: true },
  { rank: 4, term: 'محول HDMI VGA', count: 352, found: true },
  { rank: 5, term: 'كابل شاشة 4K', count: 290, found: false },
  { rank: 6, term: 'سماعات JBL', count: 215, found: false },
  { rank: 7, term: 'مقبس خارجي', count: 198, found: true },
  { rank: 8, term: 'كابل HDMI 2.1', count: 176, found: true },
]

const categoryInterest = [
  { name: 'كابلات', value: 3820, color: '#1E6FBF' },
  { name: 'مقابس', value: 2340, color: '#F47920' },
  { name: 'شبكات', value: 1980, color: '#22C55E' },
  { name: 'صوت', value: 1450, color: '#8B5CF6' },
  { name: 'محولات', value: 980, color: '#F59E0B' },
  { name: 'أخرى', value: 620, color: '#64748B' },
]

const RANGES = ['today', 'last7Days', 'last30Days', 'custom']

const Analytics = () => {
  const { t } = useTranslation()
  const [range, setRange] = useState('last30Days')

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t('nav.analytics')} />

      {/* Date range */}
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar size={16} className="text-gray-400" />
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              range === r ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={range === r ? { backgroundColor: '#1E6FBF' } : {}}
          >
            {t(`analytics.${r}`)}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('analytics.pageViews')} value="48,320" icon={Eye} trend={12} color="#1E6FBF" />
        <StatCard title={t('analytics.uniqueVisitors')} value="12,840" icon={Users} trend={8} color="#F47920" />
        <StatCard title={t('analytics.avgSession')} value="3:24" icon={Clock} trend={-2} color="#22C55E" />
        <StatCard title={t('analytics.bounceRate')} value="38.4%" icon={Percent} trend={-5} color="#8B5CF6" />
      </div>

      {/* Area Chart */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.visitorsPerDay')}</h3>
        <AreaChartComp
          data={visitorsPerDay}
          xKey="date"
          areas={[
            { key: 'visitors', name: t('analytics.visitors'), color: '#1E6FBF' },
            { key: 'pageViews', name: t('analytics.pageViews'), color: '#F47920' },
          ]}
        />
      </div>

      {/* Bar Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.visitorsByHour')}</h3>
          <BarChartComp
            data={byHour}
            xKey="hour"
            bars={[{ key: 'visitors', name: t('analytics.visitors'), color: '#1E6FBF' }]}
            height={220}
          />
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.topCities')}</h3>
          <BarChartComp
            data={citiesData}
            xKey="city"
            bars={[{ key: 'visitors', name: t('analytics.visitors'), color: '#F47920' }]}
            horizontal
            height={220}
          />
        </div>
      </div>

      {/* Product Interest */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.productInterest')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="pb-3 text-start font-medium">#</th>
                <th className="pb-3 text-start font-medium">{t('common.name')} AR</th>
                <th className="pb-3 text-start font-medium">EN</th>
                <th className="pb-3 text-start font-medium">{t('products.category')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.totalViews')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.viewsToday')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.viewsThisWeek')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.trend')}</th>
              </tr>
            </thead>
            <tbody>
              {productInterest.map((p) => (
                <tr key={p.rank} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{p.rank}</td>
                  <td className="py-3 font-medium text-gray-800">{p.name_ar}</td>
                  <td className="py-3 text-gray-500 text-xs">{p.name_en}</td>
                  <td className="py-3"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{p.category}</span></td>
                  <td className="py-3 font-semibold">{p.total.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">{p.today}</td>
                  <td className="py-3 text-gray-600">{p.week}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 text-xs font-medium ${p.trend >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {p.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(p.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad Performance + Category Interest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.adPerformance')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="pb-3 text-start font-medium">الإعلان</th>
                  <th className="pb-3 text-start font-medium">{t('ads.position')}</th>
                  <th className="pb-3 text-start font-medium">{t('analytics.impressions')}</th>
                  <th className="pb-3 text-start font-medium">{t('analytics.clicks')}</th>
                  <th className="pb-3 text-start font-medium">CTR%</th>
                  <th className="pb-3 text-start font-medium">{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {adPerformance.map((ad, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800 text-xs">{ad.title}</td>
                    <td className="py-3"><span className="bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full text-xs">{ad.position}</span></td>
                    <td className="py-3 text-gray-600">{ad.impressions.toLocaleString()}</td>
                    <td className="py-3 font-semibold">{ad.clicks}</td>
                    <td className="py-3 text-green-500 font-medium">{ad.ctr}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ad.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {ad.active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.categoryInterest')}</h3>
          <DonutChartComp data={categoryInterest} height={220} />
        </div>
      </div>

      {/* Search Terms */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h3 className="font-semibold text-gray-800 mb-4">{t('analytics.searchTerms')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="pb-3 text-start font-medium">{t('analytics.rank')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.searchTerm')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.count')}</th>
                <th className="pb-3 text-start font-medium">{t('analytics.resultsFound')}</th>
              </tr>
            </thead>
            <tbody>
              {searchTerms.map((s) => (
                <tr key={s.rank} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-gray-400 font-medium">{s.rank}</td>
                  <td className="py-2.5 font-medium text-gray-800">{s.term}</td>
                  <td className="py-2.5 font-semibold">{s.count.toLocaleString()}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.found ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {s.found ? 'نعم' : 'لا'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
