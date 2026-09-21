import { useState, useEffect } from 'react'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import type { Order } from '@/types'
import { MessageCircle } from 'lucide-react'

export function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await api.getOrders('store-batik-01')
        setOrders(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="pb-6 border-b border-[#e8e2d9]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
            Buku Kontak
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight mt-1">
            Data Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Daftar pembeli yang telah bertransaksi dan menghubungi toko Anda via WhatsApp.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-muted">Memuat data pelanggan...</div>
        ) : (
          <div className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs divide-y divide-[#e8e2d9]/60">
            {orders.map((o) => (
              <div key={o.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center font-serif text-sm font-semibold text-[#cc785c]">
                    {o.buyer_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-[#141413]">{o.buyer_name}</h3>
                    <p className="text-xs text-muted font-mono">{o.buyer_phone}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{o.shipping_address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="font-serif text-sm font-medium text-[#141413] block">
                      {formatIDR(o.total_amount || o.subtotal)}
                    </span>
                    <Badge status={o.status} className="mt-0.5" />
                  </div>

                  <a
                    href={`https://wa.me/${o.buyer_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#156d30] transition-colors"
                    title="Chat Pelanggan di WhatsApp"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
