import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageCircle, SlidersHorizontal, Package, RefreshCw, Lock } from 'lucide-react'
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
  }, [])

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
      order.buyer_phone.includes(query)

    return matchesStatus && matchesSearch
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-canvas flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-surface-card border border-hairline shadow-xs">
          <div className="size-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-primary mx-auto mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-ink">Pesanan Toko Bersifat Privat</h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d9]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              Manajemen Siklus Pesanan
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink tracking-tight mt-1">
              Daftar Pesanan Masuk
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Perbarui progres transaksi WhatsApp, masukkan resi kurir, dan kelola ongkos kirim.
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={loadOrders} className="self-start sm:self-auto">
            <RefreshCw className="size-3.5" />
            <span>Segarkan</span>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                  className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-2xs font-semibold'
                      : 'bg-surface-card text-ink border-hairline hover:bg-surface-soft'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              placeholder="Cari kode, nama, no. WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md bg-surface-card border border-hairline text-xs text-ink placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Orders Table / Cards */}
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-base text-muted mt-3">Memuat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="mt-8 p-12 text-center rounded-xl bg-surface-card border border-hairline">
            <Package className="size-10 text-muted/40 mx-auto mb-2" />
            <p className="font-serif text-lg font-medium text-ink">Tidak ada pesanan ditemukan</p>
            <p className="text-xs text-muted mt-1">
              Tidak ada data pesanan pada tab atau filter pencarian ini.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {filteredOrders.map((order) => {
              const buyerWaClean = sanitizeWhatsApp(order.buyer_phone)
              const directWaUrl = `https://wa.me/${buyerWaClean}`

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-xl bg-surface-card border border-hairline hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Order Code & Customer */}
                  <div className="flex flex-col gap-1 min-w-0 max-w-md">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-ink bg-canvas px-2 py-0.5 rounded border border-hairline">
                        {order.order_code}
                      </span>
                      <Badge status={order.status} />
                      <span className="text-[11px] text-muted">
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="mt-1">
                      <span className="font-medium text-sm text-ink">{order.buyer_name}</span>
                      <span className="text-xs text-muted font-mono ml-2">({order.buyer_phone})</span>
                    </div>

                    <p className="text-xs text-muted line-clamp-1">
                      📍 {order.shipping_address}
                    </p>

                    {/* Snapshot of items */}
                    <div className="text-[11px] text-muted-soft mt-1">
                      {order.items_snapshot.map((item, idx) => (
                        <span key={idx}>
                          {item.quantity}x {item.product_name}
                          {idx < order.items_snapshot.length - 1 ? ' • ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Middle Column: Financials & Shipping Info */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-1 text-left lg:text-right shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-muted block">
                        Total Pesanan
                      </span>
                      <span className="font-serif text-xl font-medium text-ink">
                        {formatIDR(order.total_amount || order.subtotal)}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted">
                      {order.shipping_fee > 0 ? (
                        <span>Ongkir: {formatIDR(order.shipping_fee)}</span>
                      ) : (
                        <span className="text-status-amber">Ongkir belum diset</span>
                      )}
                      {order.tracking_number && (
                        <span className="block font-mono text-[10px] text-primary">
                          Resi: {order.tracking_number}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-hairline/60 shrink-0">
                    <a
                      href={directWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-md bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#136329] border border-[#25D366]/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Chat pembeli di WhatsApp"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Chat WA</span>
                    </a>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(order)}
                    >
                      <SlidersHorizontal className="size-3.5 text-primary" />
                      <span>Kelola Status</span>
                    </Button>
                  </div>
                </div>
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
