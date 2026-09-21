import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { StorefrontPage } from '@/pages/StorefrontPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AuthPage } from '@/pages/AuthPage'

function AppContent() {
  const location = useLocation()
  const isDashboardRoute = [
    '/dashboard',
    '/orders',
    '/katalog',
    '/pelanggan',
    '/laporan',
    '/pengaturan',
  ].some((r) => location.pathname.startsWith(r))

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {!isDashboardRoute && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/pelanggan" element={<CustomersPage />} />
          <Route path="/laporan" element={<ReportsPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="/:slug" element={<StorefrontPage />} />
        </Routes>
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
