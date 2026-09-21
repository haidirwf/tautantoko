import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  MessageCircle,
  ArrowRight,
  Plus,
  Lock,
} from 'lucide-react'
import type { DashboardMetrics, Order } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Badge } from '@/components/ui/badge'
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
  const storeName = user?.name || 'Batik Nusantara'

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

  // If user is not authenticated, show the private area security wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#efe9de] border border-[#e8e2d9] shadow-xs">
          <div className="size-12 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mx-auto mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-ink">Area Privat Penjual</h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
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
          <p className="font-serif text-base text-muted mt-3">Menyiapkan ruang kerja toko...</p>
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

  return (
    <DashboardLayout onAddProductClick={() => setIsAddProductOpen(true)}>
      <div className="flex flex-col gap-8">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#cc785c] font-semibold uppercase">
              RUANG KERJAMU
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141413] mt-1">
              Selamat datang di {storeName}.
            </h1>
            <p className="text-xs sm:text-sm text-[#706c64] mt-1.5">
              Ikhtisar terbaru berdasarkan aktivitas tokomu yang tersimpan.
            </p>
          </div>

          <Button
            onClick={() => setIsAddProductOpen(true)}
            className="h-10 px-5 text-xs sm:text-sm font-medium bg-[#cc785c] hover:bg-[#a9583e] text-white rounded-md shrink-0 shadow-2xs self-start sm:self-auto"
          >
            <Plus className="size-4" />
            <span>Tambah produk</span>
          </Button>
        </div>

        {/* 4-Metric Connected Bar matching user reference */}
        <div className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e2d9]">
          {/* 1. Pendapatan selesai */}
          <div className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span>Pendapatan selesai</span>
              <DollarSign className="size-4 text-[#8c867b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] mt-4 tracking-tight">
              {metrics.total_settled_revenue > 0 ? formatIDR(metrics.total_settled_revenue) : 'Rp 0'}
            </div>
          </div>

          {/* 2. Pesanan aktif */}
          <div className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span>Pesanan aktif</span>
              <ShoppingBag className="size-4 text-[#8c867b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] mt-4 tracking-tight">
              {metrics.pending_orders_count + 1}
            </div>
          </div>

          {/* 3. Pelanggan */}
          <div className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span>Pelanggan</span>
              <Users className="size-4 text-[#8c867b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] mt-4 tracking-tight">
              {recentOrders.length}
            </div>
          </div>

          {/* 4. Stok menipis / Katalog */}
          <div className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span>Stok menipis</span>
              <Package className="size-4 text-[#8c867b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] mt-4 tracking-tight">
              1
            </div>
          </div>
        </div>

        {/* Content Split: Pesanan Terbaru (Left) & WhatsApp Follow-up Callout (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Pesanan Terbaru (7 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9]">
              <h3 className="font-serif text-xl font-normal text-[#141413]">
                Pesanan terbaru
              </h3>
              <Link
                to="/orders"
                className="text-xs text-[#706c64] hover:text-[#cc785c] transition-colors font-medium flex items-center gap-1"
              >
                <span>Lihat semua</span>
                <span>&gt;</span>
              </Link>
            </div>

            <div className="mt-3 flex flex-col divide-y divide-[#e8e2d9]/70 bg-white rounded-xl border border-[#e8e2d9] overflow-hidden shadow-2xs">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted">
                  Belum ada pesanan masuk.
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate('/orders')}
                    className="p-4 hover:bg-[#faf8f5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[#141413]">
                          {order.buyer_name}
                        </span>
                        <span className="font-mono text-xs text-muted">
                          {order.order_code}
                        </span>
                      </div>
                      <p className="text-xs text-[#706c64] mt-0.5 line-clamp-1">
                        {order.items_snapshot.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge status={order.status} />
                      <span className="font-serif text-sm sm:text-base font-medium text-[#141413]">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Dark Card Callout (5 Cols) matching user screenshot */}
          <div className="lg:col-span-4 rounded-xl bg-[#111625] text-white p-7 flex flex-col justify-between shadow-md">
            <div>
              <div className="size-10 rounded-full bg-[#1b2238] flex items-center justify-center text-[#7c9cd1] mb-6">
                <MessageCircle className="size-5" />
              </div>

              <h4 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white leading-snug">
                {metrics.pending_orders_count} pesanan menunggu chat.
              </h4>

              <p className="text-xs text-[#9bb0d1] mt-2.5 leading-relaxed">
                Buka daftar pesanan untuk menindaklanjuti calon pembeli dan mengirim info rekening.
              </p>
            </div>

            <div className="mt-8">
              <Link to="/orders">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-md bg-white hover:bg-white/90 text-[#111625] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-[0.98]"
                >
                  <span>Tinjau pesanan</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </Link>
            </div>
          </div>
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
            <label className="text-xs font-medium block mb-1">Nama Produk <span className="text-primary">*</span></label>
            <input
              type="text"
              required
              placeholder="cth. Kemeja Tenun Parang"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Harga Satuan (IDR) <span className="text-primary">*</span></label>
            <input
              type="number"
              required
              placeholder="250000"
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm font-mono text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              placeholder="Bahan katun adem, nyaman dipakai..."
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              className="w-full p-3 rounded-md bg-[#faf8f5] border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-hairline">
            <Button type="button" variant="secondary" onClick={() => setIsAddProductOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
