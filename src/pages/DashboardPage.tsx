import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  MessageCircle,
  ArrowRight,
  Plus,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Share2,
} from 'lucide-react'
import type { DashboardMetrics, Order } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthModal } from '@/components/auth/AuthModal'

export function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const navigate = useNavigate()

  // New product form states
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdDesc, setNewProdDesc] = useState('')

  const storeId = 'store-batik-01'
  const storeName = user?.name || 'Batik Nusantara'
  const storeSlug = user?.storeSlug || 'batik-nusantara'
  const storeUrl = `tautan.site/${storeSlug}`

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

  const copyStoreLink = () => {
    navigator.clipboard.writeText(`https://${storeUrl}`)
    setIsLinkCopied(true)
    setTimeout(() => setIsLinkCopied(false), 2000)
  }

  // If user is not authenticated, show the private area security wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#e8e2d9] shadow-xs">
          <div className="size-12 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mx-auto mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">Area Privat Penjual</h2>
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

  return (
    <DashboardLayout onAddProductClick={() => setIsAddProductOpen(true)}>
      <div className="flex flex-col gap-6 sm:gap-7">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e8e2d9]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono tracking-widest text-[#cc785c] font-semibold uppercase">
                RINGKASAN TOKO
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
              Selamat datang di {storeName}
            </h1>
            <p className="text-xs sm:text-sm text-[#706c64] mt-0.5">
              Pantau performa penjualan harian dan kelola pesanan WhatsApp masuk.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href={`/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-lg bg-white border border-[#e8e2d9] text-xs font-medium text-[#141413] hover:bg-[#faf8f5] flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Lihat Toko</span>
              <ExternalLink className="size-3 text-[#706c64]" />
            </a>

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="h-9 px-4 rounded-lg bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* 4-Metric Connected Bar - Clean, Crisp White & Tabular Font */}
        <div className="rounded-2xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e2d9]">
          {/* 1. Pendapatan selesai */}
          <div className="p-5 flex flex-col justify-between hover:bg-[#faf8f5]/60 transition-colors">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span className="font-medium">Pendapatan selesai</span>
              <div className="size-7 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#706c64]">
                <DollarSign className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] mt-3 tracking-tight">
              <AnimatedCounter
                value={metrics.total_settled_revenue}
                formatter={formatIDR}
                duration={1200}
              />
            </div>
            <span className="text-[11px] text-[#8c867b] mt-1 block">
              Transaksi berhasil
            </span>
          </div>

          {/* 2. Pesanan aktif */}
          <div className="p-5 flex flex-col justify-between hover:bg-[#faf8f5]/60 transition-colors">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span className="font-medium">Pesanan aktif</span>
              <div className="size-7 rounded-lg bg-[#fae7e0] border border-[#f2cfc2] flex items-center justify-center text-[#cc785c]">
                <ShoppingBag className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] mt-3 tracking-tight">
              <AnimatedCounter
                value={metrics.pending_orders_count + 1}
                duration={800}
              />
            </div>
            <span className="text-[11px] text-[#cc785c] font-medium mt-1 block">
              Perlu diproses / dikirim
            </span>
          </div>

          {/* 3. Pelanggan */}
          <div className="p-5 flex flex-col justify-between hover:bg-[#faf8f5]/60 transition-colors">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span className="font-medium">Pelanggan</span>
              <div className="size-7 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#706c64]">
                <Users className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] mt-3 tracking-tight">
              <AnimatedCounter
                value={recentOrders.length}
                duration={900}
              />
            </div>
            <span className="text-[11px] text-[#8c867b] mt-1 block">
              Kontak WhatsApp
            </span>
          </div>

          {/* 4. Stok menipis / Katalog */}
          <div className="p-5 flex flex-col justify-between hover:bg-[#faf8f5]/60 transition-colors">
            <div className="flex items-center justify-between text-xs text-[#706c64]">
              <span className="font-medium">Stok menipis</span>
              <div className="size-7 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#706c64]">
                <Package className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] mt-3 tracking-tight">
              <AnimatedCounter
                value={1}
                duration={600}
              />
            </div>
            <span className="text-[11px] text-[#8c867b] mt-1 block">
              Perlu ditambah stok
            </span>
          </div>
        </div>

        {/* Content Split: Pesanan Terbaru (Left) & WhatsApp Hub / Link Widget (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Pesanan Terbaru (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9]">
              <div>
                <h3 className="font-sans text-lg font-bold tracking-tight text-[#141413]">
                  Pesanan Terbaru
                </h3>
              </div>
              <Link
                to="/orders"
                className="text-xs text-[#706c64] hover:text-[#cc785c] transition-colors font-medium flex items-center gap-1 group"
              >
                <span>Lihat semua pesanan</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="mt-3 flex flex-col divide-y divide-[#e8e2d9] bg-white rounded-2xl border border-[#e8e2d9] overflow-hidden shadow-2xs">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8c867b]">
                  Belum ada pesanan masuk.
                </div>
              ) : (
                recentOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 + idx * 0.03 }}
                    onClick={() => navigate('/orders')}
                    className="p-4 sm:px-5 hover:bg-[#faf8f5]/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#141413] group-hover:text-[#cc785c] transition-colors">
                          {order.buyer_name}
                        </span>
                        <span className="font-mono text-xs text-[#8c867b]">
                          {order.order_code}
                        </span>
                      </div>
                      <p className="text-xs text-[#706c64] mt-0.5 line-clamp-1">
                        {order.items_snapshot.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <Badge status={order.status} />
                      <span className="font-sans font-bold text-sm text-[#141413]">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Clean WhatsApp Hub & Store Link Widget (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Card 1: WhatsApp Action Callout (Harmonized, Clean White) */}
            <div className="rounded-2xl bg-white border border-[#e8e2d9] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-full bg-[#e6f4ea] border border-[#ceead6] flex items-center justify-center text-[#137333]">
                    <MessageCircle className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#137333] font-semibold bg-[#e6f4ea] px-2 py-0.5 rounded-full border border-[#ceead6]">
                    WhatsApp Hub
                  </span>
                </div>

                <h4 className="font-sans text-xl font-bold tracking-tight text-[#141413] leading-snug">
                  {metrics.pending_orders_count} pesanan menunggu chat
                </h4>

                <p className="text-xs text-[#706c64] mt-2 leading-relaxed">
                  Buka daftar pesanan untuk menindaklanjuti calon pembeli, menyepakati ongkos kirim, dan mengonfirmasi bukti transfer.
                </p>
              </div>

              <div className="mt-6">
                <Link to="/orders">
                  <button
                    type="button"
                    className="w-full h-10 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="size-4" />
                    <span>Tinjau Pesanan WhatsApp</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2: Store Link Sharing Card */}
            <div className="rounded-2xl bg-white border border-[#e8e2d9] p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="size-4 text-[#cc785c]" />
                  <span className="text-xs font-semibold text-[#141413]">Tautan Toko Publik</span>
                </div>
                <span className="size-2 rounded-full bg-[#137333]" title="Toko Aktif" />
              </div>

              <div className="p-2 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#5c5850] truncate select-all pl-1">
                  {storeUrl}
                </span>
                <button
                  type="button"
                  onClick={copyStoreLink}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#efe9de] border border-[#e8e2d9] text-xs font-medium text-[#141413] flex items-center gap-1 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  {isLinkCopied ? (
                    <>
                      <Check className="size-3 text-[#137333]" />
                      <span className="text-[11px] text-[#137333] font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 text-[#706c64]" />
                      <span className="text-[11px]">Salin</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#8c867b]">
                Tempel link ini di bio Instagram, TikTok, atau status WhatsApp tokomu.
              </p>
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
