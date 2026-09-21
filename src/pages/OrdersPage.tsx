import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Search,
  MessageCircle,
  SlidersHorizontal,
  Package,
  RefreshCw,
  Lock,
  DollarSign,
  Clock,
  Truck,
  CheckCircle2,
  X,
  Copy,
  Check,
} from 'lucide-react'
import type { Order, OrderStatus } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR, sanitizeWhatsApp } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderEditModal } from '@/components/dashboard/OrderEditModal'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthModal } from '@/components/auth/AuthModal'

export function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const storeId = 'store-batik-01'
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const loadOrders = async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const data = await api.getOrders(storeId)
      setOrders(data)
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [isAuthenticated])

  const handleUpdateOrder = async (
    orderId: string,
    status: OrderStatus,
    extra: Partial<Order>
  ) => {
    await api.updateOrderStatus(orderId, status, extra)
    await loadOrders()
  }

  const openEditModal = (order: Order) => {
    setSelectedOrder(order)
    setIsEditModalOpen(true)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Summary Metrics calculations
  const totalRevenue = orders.reduce(
    (acc, curr) => acc + (curr.total_amount || curr.subtotal),
    0
  )
  const pendingCount = orders.filter((o) => o.status === 'PENDING_WA').length
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length

  // Filter tabs
  const tabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING_WA', label: 'Menunggu WA' },
    { id: 'PAID', label: 'Sudah Bayar' },
    { id: 'PROCESSING', label: 'Diproses' },
    { id: 'SHIPPED', label: 'Dikirim' },
    { id: 'COMPLETED', label: 'Selesai' },
    { id: 'CANCELLED', label: 'Batal' },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      order.order_code.toLowerCase().includes(query) ||
      order.buyer_name.toLowerCase().includes(query) ||
      order.buyer_phone.includes(query) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(query))

    return matchesStatus && matchesSearch
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-white border border-[#e8e2d9] shadow-xs">
          <div className="size-12 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mx-auto mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#141413]">Pesanan Toko Bersifat Privat</h2>
          <p className="text-xs sm:text-sm text-[#706c64] mt-2 leading-relaxed">
            Hanya pemilik toko yang terautentikasi yang dapat melihat dan memperbarui status pesanan WhatsApp pembeli.
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d9]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest text-[#cc785c] font-semibold uppercase">
                MANAJEMEN TRANSAKSI
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                <span className="size-1.5 rounded-full bg-[#137333] animate-pulse" />
                Live Sync WA
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight">
              Pesanan Masuk
            </h1>
            <p className="text-xs sm:text-sm text-[#706c64] mt-1">
              Pantau pesanan WhatsApp, atur ongkos kirim yang disepakati, dan input resi ekspedisi kurir.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={loadOrders}
              disabled={isLoading}
              className="h-9 px-3.5 rounded-lg bg-white border border-[#e8e2d9] text-xs font-medium text-[#141413] hover:bg-[#faf8f5] flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              title="Segarkan daftar pesanan"
            >
              <RefreshCw className={`size-3.5 text-[#706c64] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Segarkan</span>
            </button>
          </div>
        </div>

        {/* 4-Card Quick KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Omzet */}
          <div
            onClick={() => setSelectedStatus('ALL')}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all cursor-pointer ${
              selectedStatus === 'ALL'
                ? 'border-[#cc785c] ring-1 ring-[#cc785c]/30'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/40'
            }`}
          >
            <div className="flex items-center justify-between text-[#8c867b]">
              <span className="text-xs font-medium">Total Nilai Pesanan</span>
              <div className="size-7 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#706c64]">
                <DollarSign className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#141413] mt-2 tracking-tight">
              {formatIDR(totalRevenue)}
            </div>
            <span className="text-[11px] text-[#8c867b] mt-0.5 block">
              {orders.length} transaksi tercatat
            </span>
          </div>

          {/* Card 2: Menunggu WA */}
          <div
            onClick={() => setSelectedStatus('PENDING_WA')}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all cursor-pointer ${
              selectedStatus === 'PENDING_WA'
                ? 'border-[#cc785c] ring-1 ring-[#cc785c]/30'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/40'
            }`}
          >
            <div className="flex items-center justify-between text-[#8c867b]">
              <span className="text-xs font-medium">Menunggu WA</span>
              <div className="size-7 rounded-lg bg-[#fae7e0] border border-[#f2cfc2] flex items-center justify-center text-[#cc785c]">
                <Clock className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#141413] mt-2 tracking-tight">
              {pendingCount} Pesanan
            </div>
            <span className="text-[11px] text-[#cc785c] font-medium mt-0.5 block">
              Perlu follow-up chat
            </span>
          </div>

          {/* Card 3: Dalam Pengiriman */}
          <div
            onClick={() => setSelectedStatus('SHIPPED')}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all cursor-pointer ${
              selectedStatus === 'SHIPPED'
                ? 'border-[#cc785c] ring-1 ring-[#cc785c]/30'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/40'
            }`}
          >
            <div className="flex items-center justify-between text-[#8c867b]">
              <span className="text-xs font-medium">Sedang Dikirim</span>
              <div className="size-7 rounded-lg bg-[#ede9fe] border border-[#ddd6fe] flex items-center justify-center text-[#6d28d9]">
                <Truck className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#141413] mt-2 tracking-tight">
              {shippedCount} Pesanan
            </div>
            <span className="text-[11px] text-[#6d28d9] font-medium mt-0.5 block">
              Dalam kurir ekspedisi
            </span>
          </div>

          {/* Card 4: Selesai */}
          <div
            onClick={() => setSelectedStatus('COMPLETED')}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all cursor-pointer ${
              selectedStatus === 'COMPLETED'
                ? 'border-[#cc785c] ring-1 ring-[#cc785c]/30'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/40'
            }`}
          >
            <div className="flex items-center justify-between text-[#8c867b]">
              <span className="text-xs font-medium">Selesai</span>
              <div className="size-7 rounded-lg bg-[#e6f4ea] border border-[#ceead6] flex items-center justify-center text-[#137333]">
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#141413] mt-2 tracking-tight">
              {completedCount} Pesanan
            </div>
            <span className="text-[11px] text-[#137333] font-medium mt-0.5 block">
              Dana & barang diterima
            </span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Tabs in a single segmented pill container */}
          <div className="p-1 rounded-xl bg-white border border-[#e8e2d9] shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const count =
                tab.id === 'ALL'
                  ? orders.length
                  : orders.filter((o) => o.status === tab.id).length
              const isSelected = selectedStatus === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-white font-semibold'
                      : 'text-[#706c64] hover:text-[#141413]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeOrderTabIndicator"
                      className="absolute inset-0 bg-[#cc785c] rounded-lg -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[#faf8f5] text-[#706c64] border border-[#e8e2d9]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c867b]" />
            <input
              type="text"
              placeholder="Cari nama, no. WA, resi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9.5 pl-9.5 pr-8 rounded-xl bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8c867b] hover:text-[#141413]"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Orders Table Container */}
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#e8e2d9] shadow-2xs">
            <div className="size-8 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-base text-[#706c64] mt-3">Memuat data pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-14 text-center rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs">
            <div className="size-12 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#8c867b] mx-auto mb-3">
              <Package className="size-6" />
            </div>
            <p className="font-serif text-xl font-normal text-[#141413]">Tidak ada pesanan ditemukan</p>
            <p className="text-xs text-[#706c64] mt-1 max-w-sm mx-auto">
              Tidak ada transaksi yang cocok dengan filter status atau pencarian "{searchQuery}".
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#cc785c] hover:underline"
              >
                Reset pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs divide-y divide-[#e8e2d9]/70">
            {filteredOrders.map((order, idx) => {
              const buyerWaClean = sanitizeWhatsApp(order.buyer_phone)
              const directWaUrl = `https://wa.me/${buyerWaClean}?text=${encodeURIComponent(
                `Halo kak ${order.buyer_name}, perihal pesanan ${order.order_code}...`
              )}`
              const buyerInitial = order.buyer_name ? order.buyer_name.charAt(0).toUpperCase() : 'P'

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="p-5 sm:p-6 hover:bg-[#faf8f5]/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  {/* Left Column: Order Code, Status, Customer & Items */}
                  <div className="flex flex-col gap-2 min-w-0 max-w-xl">
                    {/* Top line: Code, Badge, Timestamp */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="flex items-center gap-1 bg-[#faf8f5] px-2 py-0.5 rounded-md border border-[#e8e2d9]">
                        <span className="font-mono text-xs font-medium text-[#5c5850]">
                          {order.order_code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.order_code, order.id)}
                          className="text-[#8c867b] hover:text-[#141413] transition-colors"
                          title="Salin kode pesanan"
                        >
                          {copiedCode === order.id ? (
                            <Check className="size-3 text-[#137333]" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>

                      <Badge status={order.status} />

                      <span className="text-[11px] text-[#8c867b]">
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Customer Row */}
                    <div className="flex items-start gap-3 mt-1">
                      <div className="size-8 rounded-full bg-[#fae7e0] border border-[#f2cfc2] flex items-center justify-center font-serif text-xs font-bold text-[#cc785c] shrink-0 mt-0.5">
                        {buyerInitial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[#141413]">
                            {order.buyer_name}
                          </span>
                          <span className="text-xs text-[#8c867b] font-mono">
                            ({order.buyer_phone})
                          </span>
                        </div>
                        <p className="text-xs text-[#5c5850] mt-0.5 line-clamp-1 flex items-center gap-1.5">
                          <span className="text-[#cc785c] text-xs shrink-0">📍</span>
                          <span className="truncate">{order.shipping_address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Snapshot of ordered items */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-1.5 border-t border-[#e8e2d9]/40">
                      {order.items_snapshot.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#faf8f5] border border-[#e8e2d9] text-xs text-[#3d3d3a] font-medium"
                        >
                          <span className="font-semibold text-[#cc785c]">{item.quantity}x</span>
                          <span>{item.product_name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Price, Ongkir & Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#e8e2d9]/60 shrink-0">
                    {/* Financial Ledger & Courier Info */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c867b] block leading-none">
                        Total Pesanan
                      </span>
                      <span className="font-sans font-bold text-xl text-[#141413] tracking-tight block mt-1">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                      <div className="text-xs text-[#706c64] mt-0.5 flex flex-col sm:items-end gap-0.5">
                        {order.shipping_fee > 0 ? (
                          <span className="text-[11px] text-[#5c5850]">
                            Ongkir: {formatIDR(order.shipping_fee)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                            Ongkir belum diset
                          </span>
                        )}
                        {order.tracking_number && (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#cc785c] font-semibold">
                            <span>Resi: {order.tracking_number}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={directWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                        title="Buka percakapan WhatsApp dengan pembeli"
                      >
                        <MessageCircle className="size-4" />
                        <span>Chat WA</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => openEditModal(order)}
                        className="h-9 px-3.5 rounded-lg bg-white hover:bg-[#faf8f5] text-[#141413] border border-[#e8e2d9] text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <SlidersHorizontal className="size-3.5 text-[#cc785c]" />
                        <span>Kelola Status</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      <OrderEditModal
        order={selectedOrder}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedOrder(null)
        }}
        onSave={handleUpdateOrder}
      />
    </DashboardLayout>
  )
}
