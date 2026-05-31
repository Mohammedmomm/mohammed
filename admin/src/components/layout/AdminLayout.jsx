import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles = {
  '/dashboard': 'nav.dashboard',
  '/analytics': 'nav.analytics',
  '/products': 'nav.allProducts',
  '/products/add': 'nav.addProduct',
  '/products/bulk-price': 'nav.bulkPriceEditor',
  '/categories': 'nav.categories',
  '/brands': 'nav.brands',
  '/spec-templates': 'nav.specTemplates',
  '/advertisements': 'nav.advertisements',
  '/exchange-rate': 'nav.exchangeRate',
  '/settings': 'nav.settings',
  '/account': 'nav.myAccount',
}

const AdminLayout = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const titleKey = Object.keys(pageTitles).find((k) =>
    k.includes(':') ? location.pathname.startsWith(k.split(':')[0]) : location.pathname === k
  )
  const title = titleKey ? t(pageTitles[titleKey]) : ''

  return (
    <div className="admin-layout min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
