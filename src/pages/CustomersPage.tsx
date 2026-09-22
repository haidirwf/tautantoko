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
          <div className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs">
            {/* Mobile & Tablet Card Layout (< lg) */}
            <div className="block lg:hidden divide-y divide-[#e8e2d9]">
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
                    className="p-4 flex flex-col gap-3 hover:bg-[#faf8f5]/60 transition-colors"
                  >
                    {/* Header: Customer Info + Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
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
                      <Badge status={o.status} />
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-[#faf8f5]/70 rounded-xl p-3 border border-[#e8e2d9]/60 flex items-start gap-1.5 text-xs text-[#706c64]">
                      <MapPin className="size-3.5 text-[#cc785c] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-xs leading-relaxed">
                        {o.shipping_address}
                      </span>
                    </div>

                    {/* Total & Action */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c867b] block">
                          Total Transaksi
                        </span>
                        <span className="font-sans font-bold text-sm sm:text-base text-[#141413] tracking-tight block">
                          {formatIDR(o.total_amount || o.subtotal)}
                        </span>
                        <span className="text-[10px] text-[#8c867b] font-mono block">
                          Kode: {o.order_code}
                        </span>
                      </div>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
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

            {/* Desktop Table Layout (>= lg) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-[#e8e2d9] text-[11px] font-mono uppercase tracking-wider text-[#8c867b]">
                    <th className="py-3 px-5 font-semibold">Pelanggan</th>
                    <th className="py-3 px-5 font-semibold">Alamat Pengiriman</th>
                    <th className="py-3 px-5 font-semibold">Status Pesanan</th>
                    <th className="py-3 px-5 font-semibold text-right">Total Transaksi</th>
                    <th className="py-3 px-5 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e2d9]">
                  {filteredOrders.map((o, idx) => {
                    const waClean = o.buyer_phone.replace(/[^0-9]/g, '')
                    const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(
                      `Halo kak ${o.buyer_name}, terima kasih telah berbelanja di toko kami!`
                    )}`

                    return (
                      <motion.tr
                        key={o.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: idx * 0.02 }}
                        className="hover:bg-[#faf8f5]/60 transition-colors"
                      >
                        {/* 1. Pelanggan */}
                        <td className="py-3.5 px-5 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
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
                        </td>

                        {/* 2. Alamat */}
                        <td className="py-3.5 px-5 align-middle max-w-xs">
                          <div className="flex items-start gap-1.5 text-xs text-[#706c64]">
                            <MapPin className="size-3 text-[#cc785c] shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-[11px] leading-relaxed">
                              {o.shipping_address}
                            </span>
                          </div>
                        </td>

                        {/* 3. Status */}
                        <td className="py-3.5 px-5 align-middle whitespace-nowrap">
                          <Badge status={o.status} />
                        </td>

                        {/* 4. Total */}
                        <td className="py-3.5 px-5 align-middle text-right whitespace-nowrap">
                          <span className="font-sans font-bold text-sm text-[#141413] tracking-tight block">
                            {formatIDR(o.total_amount || o.subtotal)}
                          </span>
                          <span className="text-[10px] text-[#8c867b] font-mono block">
                            Order: {o.order_code}
                          </span>
                        </td>

                        {/* 5. Aksi */}
                        <td className="py-3.5 px-5 align-middle text-right whitespace-nowrap">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-2xs"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle className="size-3.5" />
                            <span>Chat WA</span>
                          </a>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

