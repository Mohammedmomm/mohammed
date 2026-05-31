import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package, FolderTree, Tag, Megaphone, DollarSign,
  Users, TrendingUp, Plus, RefreshCw, Settings,
  Eye, Clock, CheckCircle,
} from 'lucide-react'
import StatCard from '../components/shared/StatCard'
import LineChartComp from '../components/charts/LineChartComp'
import DonutChartComp from '../components/charts/DonutChartComp'
import useAuthStore from '../store/authStore'

const visitorsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  visitors: Math.floor(Math.random() * 300 + 100),
  pageViews: Math.floor(Math.random() * 600 + 200),
}))

const deviceData = [
  { name: 'Mobile', value: 58, color: '#1E6FBF' },
  { name: 'Desktop', value: 32, color: '#F47920' },
  { name: 'Tablet', value: 10, color: '#22C55E' },
]

const topProducts = [
  { rank: 1, name_ar: 'كابل HDMI 4K سامسونج', category: 'كابلات', views: 1842, trend: '+12%' },
  { rank: 2, name_ar: 'مقبس USB-C سريع الشحن', category: 'مقابس', views: 1654, trend: '+8%' },
  { rank: 3, name_ar: 'سلك شبكة CAT6 100m', category: 'شبكات', views: 1230, trend: '+5%' },
  { rank: 4, name_ar: 'محول HDMI إلى VGA', category: 'محولات', views: 980, trend: '+3%' },
  { rank: 5, name_ar: 'كابل صوت AUX 3.5mm', category: 'صوت', views: 870, trend: '-2%' },
]

const topAds = [
  { title_ar: 'عرض كابلات HDMI 4K', position: 'hero', clicks: 342, ctr: '4.2%' },
  { title_ar: 'تخفيضات أجهزة صوتية', position: 'sidebar', clicks: 218, ctr: '3.1%' },
  { title_ar: 'وصل جديد: كابلات فايبر', position: 'popup', clicks: 195, ctr: '5.8%' },
]

const activities = [
  { icon: Plus, text: 'تم إضافة منتج جديد: كابل HDMI 8K', time: 'منذ 5 دقائق', color: '#22C55E' },
  { icon: RefreshCw, text: 'تم تحديث سعر الصرف إلى 13,500 ل.س', time: 'منذ ساعة', color: '#1E6FBF' },
  { icon: Megaphone, text: 'إعلان جديد: عرض الصيف نشط', time: 'منذ 3 ساعات', color: '#F47920' },
  { icon: CheckCircle, text: 'تم تحديث 15 منتج بنجاح', time: 'منذ 5 ساعات', color: '#22C55E' },
  { icon: Settings, text: 'تم تحديث إعدادات الموقع', time: 'أمس', color: '#64748B' },
]

const Dashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const admin = useAuthStore((s) => s.admin)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1E6FBF 0%, #155A99 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{t('dashboard.welcomeBack')}، {admin?.username || 'Admin'} 👋</h2>
            <p className="text-blue-200 text-sm mt-1">{t('dashboard.todayStats')}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title={t('dashboard.totalProducts')} value="1,284" icon={Package} trend={5} color="#1E6FBF" />
        <StatCard title={t('dashboard.available')} value="1,102" icon={CheckCircle} trend={3} color="#22C55E" />
        <StatCard title={t('dashboard.categoriesCount')} value="24" icon={FolderTree} color="#8B5CF6" />
        <StatCard title={t('dashboard.brandsCount')} value="38" icon={Tag} color="#F47920" />
        <StatCard title={t('dashboard.activeAds')} value="7" icon={Megaphone} trend={2} color="#F59E0B" />
        <StatCard title={t('dashboard.exchangeRate')} value="13,500 ل.س" icon={DollarSign} subtitle="/ دولار" color="#EF4444" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">{t('dashboard.dailyVisitors')}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">آخر 30 يوم</span>
          </div>
          <LineChartComp
            data={visitorsData}
            xKey="day"
            lines={[
              { key: 'visitors', name: 'الزوار', color: '#1E6FBF' },
              { key: 'pageViews', name: 'مشاهدات', color: '#F47920' },
            ]}
          />
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('dashboard.trafficByDevice')}</h3>
          <DonutChartComp data={deviceData} />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Eye size={16} style={{ color: '#1E6FBF' }} />
              {t('dashboard.mostViewedProducts')}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium text-start">#</th>
                <th className="pb-2 font-medium text-start">المنتج</th>
                <th className="pb-2 font-medium text-start">المشاهدات</th>
                <th className="pb-2 font-medium text-start">الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.rank} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-400 text-xs">{p.rank}</td>
                  <td className="py-2.5">
                    <div>
                      <p className="font-medium text-gray-700 text-xs">{p.name_ar}</p>
                      <p className="text-gray-400 text-xs">{p.category}</p>
                    </div>
                  </td>
                  <td className="py-2.5 font-semibold text-gray-700">{p.views.toLocaleString()}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-medium ${p.trend.startsWith('+') ? 'text-green-500' : 'text-red-400'}`}>
                      {p.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Clicked Ads */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Megaphone size={16} style={{ color: '#F47920' }} />
              {t('dashboard.mostClickedAds')}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium text-start">الإعلان</th>
                <th className="pb-2 font-medium text-start">الموضع</th>
                <th className="pb-2 font-medium text-start">النقرات</th>
                <th className="pb-2 font-medium text-start">CTR</th>
              </tr>
            </thead>
            <tbody>
              {topAds.map((ad, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-xs font-medium text-gray-700">{ad.title_ar}</td>
                  <td className="py-2.5">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{ad.position}</span>
                  </td>
                  <td className="py-2.5 font-semibold text-gray-700">{ad.clicks}</td>
                  <td className="py-2.5 text-green-500 font-medium text-xs">{ad.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={16} style={{ color: '#1E6FBF' }} />
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: a.color + '20' }}
                >
                  <a.icon size={14} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{t('dashboard.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('dashboard.addProduct'), icon: Package, color: '#1E6FBF', to: '/products/add' },
              { label: t('dashboard.updateExchangeRate'), icon: DollarSign, color: '#F47920', to: '/exchange-rate' },
              { label: t('dashboard.addAdvertisement'), icon: Megaphone, color: '#8B5CF6', to: '/advertisements' },
              { label: t('dashboard.siteSettings'), icon: Settings, color: '#22C55E', to: '/settings' },
            ].map((action) => (
              <button
                key={action.to}
                onClick={() => navigate(action.to)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: action.color + '15' }}
                >
                  <action.icon size={20} style={{ color: action.color }} />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
