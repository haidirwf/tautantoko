import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListOrdered, ExternalLink, LogOut, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthModal } from '@/components/auth/AuthModal'

export function Navbar() {
  const location = useLocation()
  const path = location.pathname
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const isMerchantArea = path.startsWith('/dashboard') || path.startsWith('/orders')
  const isLandingPage = path === '/'

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-canvas/85 backdrop-blur-md border-b border-hairline transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-medium tracking-tight text-ink flex items-center">
              tautan<span className="text-primary font-sans text-base font-normal">.site</span>
            </span>
          </Link>

          {/* Navigation Links in Center */}
          {isLandingPage ? (
            <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-muted">
              <a href="#features" className="hover:text-ink transition-colors">
                Fitur
              </a>
              <a href="#usecases" className="hover:text-ink transition-colors">
                Use Cases
              </a>
              <a href="#how" className="hover:text-ink transition-colors">
                Cara Kerja
              </a>
              <a href="#faq" className="hover:text-ink transition-colors">
                FAQ
              </a>
            </nav>
          ) : isMerchantArea ? (
            <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  path === '/dashboard'
                    ? 'bg-surface-card text-ink border border-hairline font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <LayoutDashboard className="size-3.5 text-primary" />
                <span>Dashboard Finansial</span>
              </Link>

              <Link
                to="/orders"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  path === '/orders'
                    ? 'bg-surface-card text-ink border border-hairline font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <ListOrdered className="size-3.5 text-primary" />
                <span>Kelola Pesanan</span>
              </Link>
            </nav>
          ) : (
            <nav className="hidden sm:flex items-center gap-2 text-xs text-muted">
              <Link to="/" className="hover:text-ink">Beranda</Link>
              <span>•</span>
              <span className="text-ink font-medium">Etalase Toko</span>
            </nav>
          )}

          {/* Right Action: Auth / Logout / Mulai Gratis */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Link to public store */}
                <Link
                  to={`/${user.storeSlug || 'batik-nusantara'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-card border border-hairline text-xs font-medium text-ink hover:bg-surface-soft transition-colors"
                >
                  <span>Lihat Toko</span>
                  <ExternalLink className="size-3 text-muted" />
                </Link>

                {isMerchantArea ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas hover:bg-surface-card border border-hairline text-xs font-medium text-muted hover:text-status-error transition-colors"
                    title="Keluar dari akun penjual"
                  >
                    <LogOut className="size-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-canvas hover:bg-ink/90 transition-all shadow-2xs"
                  >
                    <span>Dashboard Toko</span>
                    <ArrowRight className="size-3" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full bg-ink px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-canvas hover:bg-ink/90 transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Mulai gratis</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal for 30s registration */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
