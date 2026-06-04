import { useState, useEffect, useRef } from 'react'
import { Menu, Bell, ChevronDown, User, LogOut, Settings, Check, Trash2, Package, Tag, Star, TrendingUp, Megaphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useUiStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'
import LangToggle from '../shared/LangToggle'
import axiosInstance from '../../api/axiosInstance'

const typeIcon = (type) => {
  if (type?.startsWith('product')) return <Package size={14} className="text-blue-500" />
  if (type?.startsWith('category')) return <Tag size={14} className="text-purple-500" />
  if (type?.startsWith('brand')) return <Star size={14} className="text-yellow-500" />
  if (type?.startsWith('exchange')) return <TrendingUp size={14} className="text-green-500" />
  if (type?.startsWith('ad')) return <Megaphone size={14} className="text-orange-500" />
  return <Bell size={14} className="text-gray-400" />
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'الآن'
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  return `منذ ${Math.floor(h / 24)} يوم`
}

const Header = ({ title }) => {
  const { toggleSidebar } = useUiStore()
  const { admin, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const bellRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications?limit=20')
      const data = res.data?.data
      setNotifications(data?.notifications || [])
      setUnread(data?.unread_count ?? 0)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
      setUnread((u) => Math.max(0, u - 1))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnread(0)
    } catch {}
  }

  const clearAll = async () => {
    try {
      await axiosInstance.delete('/notifications/clear-all')
      setNotifications([])
      setUnread(0)
    } catch {}
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      className="h-15 flex items-center justify-between px-6 bg-white border-b border-gray-100"
      style={{ height: 60, flexShrink: 0 }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <Menu size={20} />
        </button>
        {title && <h2 className="text-base font-semibold text-gray-800">{title}</h2>}
      </div>

      <div className="flex items-center gap-3">
        <LangToggle />

        {/* Notification Bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span
                className="absolute top-1 end-1 min-w-[16px] h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5"
                style={{ backgroundColor: '#F47920' }}
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute end-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl w-80 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">الإشعارات</span>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Check size={12} /> قراءة الكل
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> مسح الكل
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">لا توجد إشعارات</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{typeIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                          {n.title_ar}
                        </p>
                        {n.body_ar && <p className="text-xs text-gray-500 truncate">{n.body_ar}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#1E6FBF' }} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: '#1E6FBF' }}
            >
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {admin?.username || 'Admin'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute end-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg w-44 z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { navigate('/account'); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={15} />
                  {t('nav.myAccount')}
                </button>
                <button
                  onClick={() => { navigate('/settings'); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={15} />
                  {t('nav.settings')}
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  {t('nav.logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
