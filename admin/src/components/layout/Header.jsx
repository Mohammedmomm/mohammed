import { useState } from 'react'
import { Menu, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useUiStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'
import LangToggle from '../shared/LangToggle'

const Header = ({ title }) => {
  const { toggleSidebar } = useUiStore()
  const { admin, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

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

        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <Bell size={18} />
          <span
            className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#F47920' }}
          />
        </button>

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
