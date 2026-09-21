import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
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

  // Group merchant routes together to keep sidebar stable during tab switches
  const transitionKey = isDashboardRoute ? 'merchant-suite' : location.pathname

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {!isDashboardRoute && <Navbar />}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            <Routes location={location}>
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
          </motion.div>
        </AnimatePresence>
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
