import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import BulkPriceEditor from './pages/products/BulkPriceEditor'
import Categories from './pages/Categories'
import Brands from './pages/Brands'
import SpecTemplates from './pages/SpecTemplates'
import Advertisements from './pages/Advertisements'
import ExchangeRate from './pages/ExchangeRate'
import Settings from './pages/Settings'
import Account from './pages/Account'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Noto Sans Arabic, Inter, sans-serif',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/bulk-price" element={<BulkPriceEditor />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="spec-templates" element={<SpecTemplates />} />
          <Route path="advertisements" element={<Advertisements />} />
          <Route path="exchange-rate" element={<ExchangeRate />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
