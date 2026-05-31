import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Package, FolderTree, Tag, ClipboardList,
  Megaphone, DollarSign, BarChart3, Settings, User, LogOut,
  ChevronDown, ChevronRight, ChevronLeft,
} from 'lucide-react'
import useUiStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'

const SidebarItem = ({ icon: Icon, label, to, collapsed, subItems, active }) => {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = subItems && subItems.length > 0
  const { t } = useTranslation()

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => !collapsed && setExpanded(!expanded)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sidebar-text hover:bg-white/10 ${
            active ? 'bg-primary text-white' : ''
          }`}
          title={collapsed ? label : undefined}
        >
          <Icon size={18} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-sm font-medium text-start">{label}</span>
              {expanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
            </>
          )}
        </button>
        {!collapsed && expanded && (
          <div className="mt-1 ms-4 border-s-2 border-white/10 ps-3 space-y-0.5">
            {subItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white font-medium'
                      : 'text-sidebar-text hover:bg-white/10'
                  }`
                }
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          isActive
            ? 'bg-primary text-white font-medium'
            : 'text-sidebar-text hover:bg-white/10'
        }`
      }
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  )
}

const Sidebar = () => {
  const { t } = useTranslation()
  const { sidebarCollapsed } = useUiStore()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const width = sidebarCollapsed ? 64 : 260

  return (
    <div
      className="sidebar-fixed flex flex-col h-screen sidebar-transition overflow-hidden"
      style={{ width, backgroundColor: '#0F1C2E', flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #1E6FBF, #F47920)' }}
        >
          <span className="text-white text-xs font-bold">SCZ</span>
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-white text-sm font-bold leading-tight">Syria Cable</p>
            <p className="text-xs font-medium" style={{ color: '#F47920' }}>Zone Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <SidebarItem
          icon={LayoutDashboard}
          label={t('nav.dashboard')}
          to="/dashboard"
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={Package}
          label={t('nav.products')}
          collapsed={sidebarCollapsed}
          subItems={[
            { to: '/products', label: t('nav.allProducts') },
            { to: '/products/add', label: t('nav.addProduct') },
            { to: '/products/bulk-price', label: t('nav.bulkPriceEditor') },
          ]}
        />
        <SidebarItem icon={FolderTree} label={t('nav.categories')} to="/categories" collapsed={sidebarCollapsed} />
        <SidebarItem icon={Tag} label={t('nav.brands')} to="/brands" collapsed={sidebarCollapsed} />
        <SidebarItem icon={ClipboardList} label={t('nav.specTemplates')} to="/spec-templates" collapsed={sidebarCollapsed} />
        <SidebarItem icon={Megaphone} label={t('nav.advertisements')} to="/advertisements" collapsed={sidebarCollapsed} />
        <SidebarItem icon={DollarSign} label={t('nav.exchangeRate')} to="/exchange-rate" collapsed={sidebarCollapsed} />
        <SidebarItem icon={BarChart3} label={t('nav.analytics')} to="/analytics" collapsed={sidebarCollapsed} />
        <SidebarItem icon={Settings} label={t('nav.settings')} to="/settings" collapsed={sidebarCollapsed} />

        <div className="my-2 border-t border-white/10" />

        <SidebarItem icon={User} label={t('nav.myAccount')} to="/account" collapsed={sidebarCollapsed} />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sidebar-text hover:bg-red-500/20 hover:text-red-400"
          title={sidebarCollapsed ? t('nav.logout') : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">{t('nav.logout')}</span>}
        </button>
      </nav>
    </div>
  )
}

export default Sidebar
