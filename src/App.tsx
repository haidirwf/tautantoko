import { useEffect } from 'react'
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
import { ReviewsPage } from '@/pages/ReviewsPage'
import { AuthPage } from '@/pages/AuthPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { useAuthStore } from '@/store/useAuthStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/Toaster'

function AppContent() {
  const location = useLocation()
  const initializeAuth = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || [
    '/orders',
    '/katalog',
    '/pelanggan',
    '/ulasan',
    '/laporan',
    '/pengaturan',
  ].some((r) => location.pathname.startsWith(r))
  const isStandaloneLayout = isDashboardRoute || location.pathname === '/onboarding'

  // Group merchant routes together to keep sidebar stable during tab switches
  const transitionKey = isDashboardRoute ? 'merchant-suite' : location.pathname

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Toaster />
      {!isStandaloneLayout && <Navbar />}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: location.pathname === '/' ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: location.pathname === '/' ? 0 : -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              
              {/* Dashboard Sub-routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/dashboard/katalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
              <Route path="/dashboard/pelanggan" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/dashboard/ulasan" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
              <Route path="/dashboard/laporan" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/dashboard/pengaturan" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Backward compatibility aliases */}
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/katalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
              <Route path="/pelanggan" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/ulasan" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
              <Route path="/laporan" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/pengaturan" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

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
