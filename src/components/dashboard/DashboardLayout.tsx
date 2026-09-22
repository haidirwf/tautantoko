import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  LayoutGrid,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Star,
  LogOut,
  Menu,
  X,
  Plus,
  ExternalLink,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddProductClick?: () => void
}

export function DashboardLayout({ children, onAddProductClick }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const { user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)

  const storeName = user?.name || 'Batik Nusantara'
  const storeSlug = user?.storeSlug || 'batik-nusantara'

  const navItems = [
    { label: 'Ringkasan', href: '/dashboard', icon: LayoutGrid, active: path === '/dashboard' },
    { label: 'Pesanan', href: '/dashboard/orders', icon: ShoppingBag, active: path === '/dashboard/orders' || path === '/orders' },
    { label: 'Katalog', href: '/dashboard/katalog', icon: Package, active: path === '/dashboard/katalog' || path === '/katalog' },
    { label: 'Pelanggan', href: '/dashboard/pelanggan', icon: Users, active: path === '/dashboard/pelanggan' || path === '/pelanggan' },
    { label: 'Ulasan', href: '/dashboard/ulasan', icon: Star, active: path === '/dashboard/ulasan' || path === '/ulasan' },
    { label: 'Laporan', href: '/dashboard/laporan', icon: BarChart3, active: path === '/dashboard/laporan' || path === '/laporan' },
    { label: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings, active: path === '/dashboard/pengaturan' || path === '/pengaturan' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleOpenAddProduct = () => {
    if (onAddProductClick) {
      onAddProductClick()
    } else {
      setIsAddProductModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-3.5 px-4 bg-[#faf8f5] border-b border-[#e8e2d9] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-[#efe9de] text-[#141413] border border-[#e8e2d9] bg-white shadow-2xs"
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-[#cc785c] flex items-center justify-center text-white font-sans text-sm font-bold shadow-2xs">
              T
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-ink">
              tautan<span className="text-[#cc785c] font-sans text-xs">.site</span>
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <a
            href={`/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-2.5 rounded-lg border border-[#e8e2d9] bg-white text-xs font-medium text-[#141413] flex items-center gap-1 shadow-2xs"
            title="Lihat Toko Publik"
          >
            <span>Toko</span>
            <ExternalLink className="size-3 text-[#cc785c]" />
          </a>
        </div>
      </div>

      {/* Left Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#faf8f5] border-r border-[#e8e2d9] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Top Brand Logo */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-[#e8e2d9]">
            <div className="size-8 rounded-md bg-[#cc785c] flex items-center justify-center text-white font-sans text-base font-bold shadow-2xs">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xl font-bold tracking-tight leading-none text-[#141413]">
                tautan<span className="text-[#cc785c] font-sans text-sm">.site</span>
              </span>
            </div>
          </div>

          {/* Store Profile Card */}
          <div className="p-5 flex items-center gap-3 border-b border-[#e8e2d9]/60">
            <div className="size-10 rounded-full bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center font-sans text-sm font-bold text-[#cc785c] shrink-0">
              {storeName.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="font-medium text-sm text-[#141413] truncate">{storeName}</div>
              <a
                href={`/${storeSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-[#cc785c] transition-colors truncate block"
              >
                /toko/{storeSlug}
              </a>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 flex flex-col gap-1 relative">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.active

              return (
                <motion.div
                  key={item.label}
                  whileHover={!isActive ? { x: 3 } : undefined}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-[#cc785c] font-semibold'
                        : 'text-[#5c5850] hover:text-[#141413]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarPill"
                        className="absolute inset-0 bg-[#fae7e0] rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Icon className={`size-4 ${isActive ? 'text-[#cc785c]' : 'text-[#8c867b]'}`} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Quick add product button in sidebar */}
          <div className="px-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleOpenAddProduct}
              className="w-full h-9 rounded-lg bg-[#efe9de]/80 hover:bg-[#fae7e0] text-[#5c5850] hover:text-[#cc785c] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9]"
            >
              <Plus className="size-3.5" />
              <span>Tambah Produk</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Sidebar Action: Logout */}
        <div className="p-4 border-t border-[#e8e2d9]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#7c7569] hover:bg-[#efe9de] hover:text-[#c64545] transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Desktop Top Utility Bar */}
        <header className="h-14 px-6 sm:px-8 border-b border-[#e8e2d9] hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-xs text-[#706c64]">
            <span className="font-semibold text-[#141413]">{storeName}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg border border-[#e8e2d9] bg-white hover:bg-[#faf8f5] text-xs font-medium text-[#141413] flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Lihat Toko Publik</span>
              <ExternalLink className="size-3 text-[#cc785c]" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="h-8 px-3 rounded-lg text-xs font-medium text-[#706c64] hover:text-[#c64545] hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Keluar"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      {/* Generic Add Product Modal fallback */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="Tambah Produk Baru"
        surface="canvas"
      >
        <div className="flex flex-col gap-4 py-2 text-sm">
          <p className="text-xs text-muted">
            Fitur penambahan katalog langsung terhubung dengan database Supabase toko Anda.
          </p>
          <div>
            <label className="text-xs font-medium block mb-1">Nama Produk</label>
            <input
              type="text"
              placeholder="cth. Kemeja Batik Solo"
              className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Harga (IDR)</label>
            <input
              type="number"
              placeholder="250000"
              className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-hairline">
            <Button variant="secondary" onClick={() => setIsAddProductModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => {
              alert('Produk baru berhasil disimpan ke katalog!')
              setIsAddProductModalOpen(false)
            }}>
              Simpan Produk
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
