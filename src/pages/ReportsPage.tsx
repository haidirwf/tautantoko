import { useState, useEffect } from 'react'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { PaymentBreakdown } from '@/components/dashboard/PaymentBreakdown'
import type { DashboardMetrics } from '@/types'

export function ReportsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await api.getDashboardMetrics('store-batik-01')
        setMetrics(data)
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
            Finansial & Tren
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight mt-1">
            Laporan Penjualan
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Analisis transaksi settled, pipeline WhatsApp, dan metode transfer pembeli.
          </p>
        </div>

        {isLoading || !metrics ? (
          <div className="py-20 text-center text-sm text-muted">Menghitung laporan keuangan...</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-[#e8e2d9] bg-white shadow-2xs">
                <span className="text-xs text-[#8c867b] font-medium">Total Omzet Terverifikasi</span>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight mt-2">
                  {formatIDR(metrics.total_settled_revenue)}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#e8e2d9] bg-white shadow-2xs">
                <span className="text-xs text-[#8c867b] font-medium">Potensi Pipeline WhatsApp</span>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-[#cc785c] tracking-tight mt-2">
                  {formatIDR(metrics.pending_revenue)}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#e8e2d9] bg-white shadow-2xs">
                <span className="text-xs text-[#8c867b] font-medium">Rata-rata Order (AOV)</span>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-[#141413] tracking-tight mt-2">
                  {formatIDR(metrics.aov)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart data={metrics.revenue_trends} />
              </div>
              <div>
                <PaymentBreakdown distribution={metrics.payment_distribution} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
