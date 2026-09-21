import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { StorefrontPage } from '@/pages/StorefrontPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { OrdersPage } from '@/pages/OrdersPage'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/:slug" element={<StorefrontPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
