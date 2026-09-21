import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  ArrowRight,
  Plus,
  Lock,
  ExternalLink,
  Settings,
  Link2,
  Star,
} from 'lucide-react'
import type { DashboardMetrics, Order } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthModal } from '@/components/auth/AuthModal'

export function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // New product form states
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdDesc, setNewProdDesc] = useState('')

  const storeId = 'store-batik-01'
  const storeOwnerName = user?.name?.toLowerCase() || 'idal'
  const storeSlug = user?.storeSlug || 'idal'
  const storeDisplayUrl = `tokolink.nasywan.web.id/${storeSlug}`

  useEffect(() => {
    async function loadDashboard() {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const [metricData, ordersData] = await Promise.all([
          api.getDashboardMetrics(storeId),
          api.getOrders(storeId),
        ])
        setMetrics(metricData)
        setRecentOrders(ordersData.slice(0, 5))
      } catch (err) {
        console.error('Error loading metrics', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [isAuthenticated])

  // If user is not authenticated, show private area security wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#e8e2d9] shadow-xs">
          <div className="size-12 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mx-auto mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
            Area Privat Penjual
          </h2>
          <p className="text-xs sm:text-sm text-[#706c64] mt-2 leading-relaxed">
            Data keuangan, analitik omzet, dan rincian pesanan hanya dapat diakses oleh pemilik toko yang terautentikasi.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button onClick={() => setIsAuthModalOpen(true)} className="w-full sm:w-auto">
              Masuk ke Akun Toko
            </Button>
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="login" />
      </div>
    )
  }

  if (isLoading || !metrics) {
    return (
      <DashboardLayout>
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin" />
          <p className="font-sans text-sm font-medium text-[#706c64] mt-3">Menyiapkan ringkasan toko...</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName.trim() || !newProdPrice) return
    alert(`Produk "${newProdName}" seharga ${formatIDR(Number(newProdPrice))} berhasil ditambahkan ke etalase toko Anda!`)
    setNewProdName('')
    setNewProdPrice('')
    setNewProdDesc('')
    setIsAddProductOpen(false)
  }

  const sixMonthLabels = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep']

  return (
    <DashboardLayout onAddProductClick={() => setIsAddProductOpen(true)}>
      <div className="flex flex-col gap-6 sm:gap-7">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#8c867b] font-semibold uppercase block mb-1">
              OVERVIEW TOKO
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              Halo, {storeOwnerName}.
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#706c64] mt-1.5">
              <span>URL Toko:</span>
              <a
                href={`/${storeSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#141413] hover:text-[#cc785c] inline-flex items-center gap-0.5 underline transition-colors"
              >
                <span>{storeDisplayUrl}</span>
                <ExternalLink className="size-3 text-[#706c64] ml-0.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="h-9 px-4 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah Produk</span>
            </button>

            <Link to="/pengaturan">
              <button
                type="button"
                className="h-9 px-4 rounded-full bg-white hover:bg-[#faf8f5] border border-[#e8e2d9] text-[#141413] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Settings className="size-3.5 text-[#706c64]" />
                <span>Pengaturan Toko</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 2. 4 Separate Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: PENDAPATAN */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#706c64] font-medium uppercase">
              PENDAPATAN
            </span>
            <div className="my-2.5">
              <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                Rp {metrics.total_settled_revenue ? metrics.total_settled_revenue.toLocaleString('id-ID') : '0'}
              </div>
            </div>
            <span className="text-xs text-[#8c867b]">
              Total dari pesanan dibayar
            </span>
          </div>

          {/* Card 2: TOTAL PESANAN */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#706c64] font-medium uppercase">
              TOTAL PESANAN
            </span>
            <div className="my-2.5 flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                {(metrics.paid_orders_count + metrics.pending_orders_count) || 2}
              </span>
              <span className="text-sm font-normal text-[#706c64]">pesanan</span>
            </div>
            <span className="text-xs text-[#8c867b]">
              Termasuk pesanan diproses & selesai
            </span>
          </div>

          {/* Card 3: PRODUK AKTIF */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#706c64] font-medium uppercase">
              PRODUK AKTIF
            </span>
            <div className="my-2.5 flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                1
              </span>
              <span className="text-sm font-normal text-[#706c64]">produk</span>
            </div>
            <span className="text-xs text-[#8c867b]">
              1 tautan aktif di halaman
            </span>
          </div>

          {/* Card 4: RATING TOKO */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#706c64] font-medium uppercase">
              RATING TOKO
            </span>
            <div className="my-2.5 flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                0.0
              </span>
              <span className="text-sm font-normal text-[#706c64]">/ 5.0</span>
            </div>
            <span className="text-xs text-[#8c867b]">
              0 ulasan diterima
            </span>
          </div>
        </div>

        {/* 3. Tren Pendapatan 6 Bulan Terakhir */}
        <div className="rounded-2xl border border-[#e8e2d9] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-sans font-bold text-base sm:text-lg text-[#141413]">
                Tren Pendapatan 6 Bulan Terakhir
              </h3>
              <p className="text-xs text-[#706c64] mt-0.5">
                Ringkasan total pendapatan bulanan toko
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
              Toko Aktif
            </span>
          </div>

          {/* 6 Month Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-4 px-4 sm:px-8 border-b border-[#e8e2d9]/80 pb-3">
              {sixMonthLabels.map((month) => (
                <div key={month} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative">
                  {/* Subtle capsule bar */}
                  <div className="w-12 sm:w-16 h-3.5 rounded-full bg-[#f0ede6] group-hover:bg-[#cc785c]/40 transition-colors" />
                  <span className="text-xs font-medium text-[#706c64] mt-3 group-hover:text-[#141413] transition-colors">
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Row: Pesanan Terbaru & Ulasan Terbaru */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pesanan Terbaru */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8e2d9]">
                <h3 className="font-sans font-bold text-base text-[#141413]">
                  Pesanan Terbaru
                </h3>
                <Link
                  to="/orders"
                  className="text-xs text-[#706c64] hover:text-[#cc785c] font-medium flex items-center gap-1 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                {recentOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8c867b]">
                    Belum ada pesanan masuk.
                  </div>
                ) : (
                  recentOrders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate('/orders')}
                      className="bg-[#faf8f5] hover:bg-[#f4f0e8] p-3.5 rounded-xl border border-[#e8e2d9]/60 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-mono font-semibold text-xs text-[#141413] block">
                          {order.order_code}
                        </span>
                        <span className="text-xs text-[#706c64] mt-0.5 block">
                          {order.buyer_name}
                        </span>
                      </div>
                      <span className="font-sans font-bold text-xs text-[#141413]">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Ulasan Terbaru */}
          <div className="rounded-2xl border border-[#e8e2d9] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8e2d9]">
                <h3 className="font-sans font-bold text-base text-[#141413]">
                  Ulasan Terbaru
                </h3>
                <Link
                  to="/pelanggan"
                  className="text-xs text-[#706c64] hover:text-[#cc785c] font-medium flex items-center gap-1 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="py-12 flex items-center justify-center text-xs text-[#8c867b]">
                Belum ada ulasan dari pembeli.
              </div>
            </div>
          </div>
        </div>

        {/* 5. Row: 3 Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Kelola Produk */}
          <Link
            to="/katalog"
            className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs hover:border-[#cc785c]/40 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center justify-between">
              <Package className="size-5 text-[#141413]" />
              <ArrowRight className="size-4 text-[#8c867b] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-5">
              <h4 className="font-sans font-bold text-sm text-[#141413] group-hover:text-[#cc785c] transition-colors">
                Kelola Produk
              </h4>
              <p className="text-xs text-[#706c64] mt-1 leading-relaxed">
                Tambah, edit, dan atur varian katalog produk toko Anda.
              </p>
            </div>
          </Link>

          {/* Kelola Tautan */}
          <Link
            to="/pengaturan"
            className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs hover:border-[#cc785c]/40 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center justify-between">
              <Link2 className="size-5 text-[#141413]" />
              <ArrowRight className="size-4 text-[#8c867b] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-5">
              <h4 className="font-sans font-bold text-sm text-[#141413] group-hover:text-[#cc785c] transition-colors">
                Kelola Tautan
              </h4>
              <p className="text-xs text-[#706c64] mt-1 leading-relaxed">
                Atur tautan medsos dan bio link di halaman toko Anda.
              </p>
            </div>
          </Link>

          {/* Ulasan Pembeli */}
          <Link
            to="/pelanggan"
            className="rounded-2xl border border-[#e8e2d9] bg-white p-5 shadow-2xs hover:border-[#cc785c]/40 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center justify-between">
              <Star className="size-5 text-[#e8a55a] fill-[#e8a55a]" />
              <ArrowRight className="size-4 text-[#8c867b] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-5">
              <h4 className="font-sans font-bold text-sm text-[#141413] group-hover:text-[#cc785c] transition-colors">
                Ulasan Pembeli
              </h4>
              <p className="text-xs text-[#706c64] mt-1 leading-relaxed">
                Lihat dan analisis masukan kepuasan pelanggan toko.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Tambah Produk Baru"
        surface="canvas"
      >
        <form onSubmit={handleSaveNewProduct} className="flex flex-col gap-4 py-2 text-sm">
          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Nama Produk <span className="text-[#cc785c]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth. Kemeja Tenun Parang"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Harga Satuan (IDR) <span className="text-[#cc785c]">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="250000"
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm font-mono text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              placeholder="Bahan katun adem, nyaman dipakai..."
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e8e2d9]">
            <Button type="button" variant="secondary" onClick={() => setIsAddProductOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#cc785c] hover:bg-[#a9583e] text-white">
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
