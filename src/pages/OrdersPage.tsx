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
  X,
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
  const { user, isAuthenticated } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const storeId = user?.storeId || 'store-batik-01'
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  // Filter tabs - simple & clean
  const tabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING_WA', label: 'Menunggu WA' },
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
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">Pesanan Toko Bersifat Privat</h2>
          <p className="text-xs sm:text-sm text-[#706c64] mt-2 leading-relaxed">
            Hanya pemilik toko yang terautentikasi yang dapat melihat dan mengelola pesanan WhatsApp.
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
      <div className="flex flex-col gap-5">
        {/* Simple & Clean Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d9]">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
              Pesanan Masuk
            </h1>
            <p className="text-xs text-[#706c64] mt-0.5">
              {orders.length} pesanan tercatat dari checkout WhatsApp
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            className="h-8 px-3 rounded-lg bg-white border border-[#e8e2d9] text-xs font-medium text-[#5c5850] hover:text-[#141413] hover:bg-[#faf8f5] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Segarkan data pesanan"
          >
            <RefreshCw className={`size-3 text-[#706c64] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {/* Minimal Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Simple Tab Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const count =
                tab.id === 'ALL'
                  ? orders.length
                  : orders.filter((o) => o.status === tab.id).length
              const isSelected = selectedStatus === tab.id

              if (count === 0 && tab.id !== 'ALL' && tab.id !== 'PENDING_WA') {
                return null // Don't crowd with 0-count tabs
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#706c64] hover:text-[#141413] border border-[#e8e2d9]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-1.5 text-[10px] font-mono ${isSelected ? 'opacity-70' : 'text-[#8c867b]'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Compact Search */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c867b]" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#8c867b] hover:text-[#141413]"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Clean, Calmed-Down Orders Table */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e8e2d9] shadow-2xs">
            <div className="size-6 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#706c64] mt-2.5">Memuat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#e8e2d9] shadow-2xs">
            <Package className="size-8 text-[#8c867b]/50 mx-auto mb-2" />
            <p className="font-sans text-base font-bold text-[#141413]">Tidak ada pesanan</p>
            <p className="text-xs text-[#706c64] mt-0.5">
              Tidak ada transaksi yang cocok dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs divide-y divide-[#e8e2d9]">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-12 px-5 py-3 bg-[#faf8f5] text-[11px] font-mono uppercase tracking-wider text-[#8c867b] font-medium border-b border-[#e8e2d9]">
              <div className="col-span-3">Pesanan</div>
              <div className="col-span-3">Pembeli</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>

            {/* Rows */}
            {filteredOrders.map((order, idx) => {
              const buyerWaClean = sanitizeWhatsApp(order.buyer_phone)
              const directWaUrl = `https://wa.me/${buyerWaClean}?text=${encodeURIComponent(
                `Halo kak ${order.buyer_name}, perihal pesanan ${order.order_code}...`
              )}`

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  className="p-3.5 sm:p-4 md:px-5 md:py-3.5 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 md:gap-0"
                >
                  {/* Col 1: Order Code & Date (3 cols) */}
                  <div className="md:col-span-3 min-w-0 flex items-center justify-between md:block">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#141413] bg-[#faf8f5] md:bg-transparent px-1.5 py-0.5 md:p-0 rounded border md:border-0 border-[#e8e2d9]/80">
                        {order.order_code}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c867b] block md:mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Col 2: Buyer & Items (3 cols) */}
                  <div className="md:col-span-3 min-w-0">
                    <div className="text-xs font-medium text-[#141413] truncate">
                      {order.buyer_name}
                      <span className="font-mono text-[#8c867b] ml-1.5 font-normal">({order.buyer_phone})</span>
                    </div>
                    <div className="text-[11px] text-[#706c64] truncate mt-0.5">
                      {order.items_snapshot.map((item) => `${item.quantity}x ${item.product_name}`).join(', ')}
                    </div>
                  </div>

                  {/* Mobile Row: Status & Total */}
                  <div className="flex items-center justify-between md:contents pt-2 md:pt-0 border-t md:border-t-0 border-[#f0ece5]">
                    {/* Col 3: Status (2 cols) */}
                    <div className="md:col-span-2">
                      <Badge status={order.status} />
                    </div>

                    {/* Col 4: Total & Ongkir (2 cols) */}
                    <div className="md:col-span-2 text-right">
                      <span className="font-sans font-semibold text-sm text-[#141413] block">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                      <span className="text-[10px] text-[#8c867b] block">
                        {order.shipping_fee > 0 ? (
                          `Ongkir ${formatIDR(order.shipping_fee)}`
                        ) : (
                          <span className="text-[#b45309]">Ongkir belum diset</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Col 5: Actions (2 cols) */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#f0ece5]">
                    <a
                      href={directWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial justify-center h-8 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
                      title="Chat pembeli di WhatsApp"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Chat</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => openEditModal(order)}
                      className="flex-1 md:flex-initial justify-center h-8 px-2.5 rounded-lg bg-white hover:bg-[#faf8f5] text-[#5c5850] hover:text-[#141413] border border-[#e8e2d9] text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                      title="Kelola status pesanan"
                    >
                      <SlidersHorizontal className="size-3" />
                      <span>Kelola</span>
                    </button>
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
