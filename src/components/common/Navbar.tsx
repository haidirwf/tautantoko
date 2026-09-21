import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Store, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const location = useLocation()
  const path = location.pathname

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Store, active: path === '/' },
    { href: '/batik-nusantara', label: 'Etalase Toko', icon: ShoppingBag, active: path.startsWith('/batik-nusantara') },
    { href: '/dashboard', label: 'Finansial & Analisis', icon: LayoutDashboard, active: path === '/dashboard' },
    { href: '/orders', label: 'Kelola Pesanan', icon: ListOrdered, active: path === '/orders' },
  ]

  return (
    <nav className="sticky top-0 z-30 w-full bg-canvas/90 backdrop-blur-md border-b border-hairline transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-lg bg-surface-dark flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <span className="font-serif text-lg font-bold text-primary">T</span>
          </div>
          <span className="font-serif text-2xl font-medium tracking-tight text-ink">
            tautan<span className="text-primary font-sans text-lg">.site</span>
          </span>
        </Link>

        {/* Navigation items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-surface-card text-ink border border-hairline font-semibold shadow-2xs'
                    : 'text-muted hover:text-ink hover:bg-surface-soft'
                )}
              >
                <Icon className={cn('size-4', item.active ? 'text-primary' : 'text-muted')} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
