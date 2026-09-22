import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import type { Order } from '@/types'
import { MessageCircle, Search, MapPin, X, Users } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export function CustomersPage() {
  const { user } = useAuthStore()
  const storeId = user?.storeId || 'store-batik-01'
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await api.getOrders(storeId)
        setOrders(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      o.buyer_name.toLowerCase().includes(q) ||
      o.buyer_phone.includes(q) ||
      o.shipping_address.toLowerCase().includes(q)
    )
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e2d9]">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
              Buku Kontak Pelanggan
            </h1>
            <p className="text-xs text-[#706c64] mt-0.5">
              {orders.length} pembeli terdaftar melalui transaksi checkout WhatsApp.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c867b]" />
            <input
              type="text"
              placeholder="Cari nama, WA, atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8c867b] hover:text-[#141413]"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e8e2d9] shadow-2xs">
            <div className="size-6 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#706c64] mt-2.5">Memuat data pelanggan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#e8e2d9] shadow-2xs">
            <Users className="size-8 text-[#8c867b]/50 mx-auto mb-2" />
            <p className="font-sans text-base font-bold text-[#141413]">Pelanggan tidak ditemukan</p>
            <p className="text-xs text-[#706c64] mt-0.5">
              {searchQuery ? `Tidak ada kontak yang cocok dengan "${searchQuery}"` : 'Belum ada transaksi pelanggan tercatat.'}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs divide-y divide-[#e8e2d9]">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-12 px-5 py-3 bg-[#faf8f5] text-[11px] font-mono uppercase tracking-wider text-[#8c867b] font-medium border-b border-[#e8e2d9]">
              <div className="col-span-4">Pelanggan</div>
              <div className="col-span-3">Alamat Pengiriman</div>
              <div className="col-span-2">Status Pesanan</div>
              <div className="col-span-2 text-right">Total Transaksi</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* Customer Rows */}
            {filteredOrders.map((o, idx) => {
              const waClean = o.buyer_phone.replace(/[^0-9]/g, '')
              const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(
                `Halo kak ${o.buyer_name}, terima kasih telah berbelanja di toko kami!`
              )}`

              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  className="p-3.5 sm:p-4 md:px-5 md:py-3.5 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:grid md:grid-cols-12 md:items-center gap-2.5 md:gap-0"
                >
                  {/* Col 1: Customer Name & Phone (4 cols) */}
                  <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center font-sans text-xs font-bold text-[#141413] shrink-0">
                      {o.buyer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <h3 className="font-semibold text-xs sm:text-sm text-[#141413] truncate">
                        {o.buyer_name}
                      </h3>
                      <p className="text-[11px] text-[#8c867b] font-mono">{o.buyer_phone}</p>
                    </div>
                  </div>

                  {/* Col 2: Shipping Address (3 cols) */}
                  <div className="md:col-span-3 min-w-0 pr-0 md:pr-3">
                    <div className="flex items-start gap-1.5 text-xs text-[#706c64]">
                      <MapPin className="size-3 text-[#cc785c] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-[11px] leading-relaxed">
                        {o.shipping_address}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Row: Status & Total */}
                  <div className="flex items-center justify-between md:contents pt-2 md:pt-0 border-t md:border-t-0 border-[#f0ece5]">
                    {/* Col 3: Status (2 cols) */}
                    <div className="md:col-span-2">
                      <Badge status={o.status} />
                    </div>

                    {/* Col 4: Total (2 cols) */}
                    <div className="md:col-span-2 text-right">
                      <span className="font-sans font-bold text-sm text-[#141413] tracking-tight block">
                        {formatIDR(o.total_amount || o.subtotal)}
                      </span>
                      <span className="text-[10px] text-[#8c867b] font-mono">
                        Order: {o.order_code}
                      </span>
                    </div>
                  </div>

                  {/* Col 5: Actions (1 col) */}
                  <div className="md:col-span-1 flex justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#f0ece5]">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto justify-center h-8 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
                      title="Chat WhatsApp"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Chat WA</span>
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

