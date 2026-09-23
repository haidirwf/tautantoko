import { useState, useEffect } from 'react'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { PaymentBreakdown } from '@/components/dashboard/PaymentBreakdown'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useAuthStore } from '@/store/useAuthStore'
import { CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import type { DashboardMetrics } from '@/types'

export function ReportsPage() {
  const { user } = useAuthStore()
  const storeId = user?.storeId || ''
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await api.getDashboardMetrics(storeId)
        setMetrics(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout isLoading={isLoading || !metrics}>
      <div className="flex flex-col gap-6">
        {/* Clean Header */}
        <div className="pb-4 border-b border-[#e8e2d9]">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
            Laporan Finansial & Penjualan
          </h1>
          <p className="text-xs sm:text-sm text-[#706c64] mt-0.5">
            Ringkasan omzet terverifikasi, pipeline checkout WhatsApp, dan metode transfer pelanggan.
          </p>
        </div>

        {isLoading || !metrics ? (
          <div className="rounded-2xl border border-[#e8e2d9] bg-[#e8e2d9] overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-3 gap-px animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 sm:p-5 bg-white h-28 flex flex-col justify-between">
                <div className="h-4 w-32 bg-[#e8e2d9]/50 rounded" />
                <div className="h-7 w-36 bg-[#e8e2d9]/70 rounded-md mt-2" />
                <div className="h-3 w-28 bg-[#e8e2d9]/40 rounded mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Connected Metric Bar */}
            <div className="rounded-2xl border border-[#e8e2d9] bg-[#e8e2d9] overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-3 gap-px">
              {/* 1. Omzet Terverifikasi */}
              <div className="p-4 sm:p-5 flex flex-col justify-between bg-white hover:bg-[#faf8f5]/60 transition-colors min-w-0">
                <div className="flex items-center justify-between text-xs text-[#706c64] gap-2">
                  <span className="font-medium truncate">Omzet Terverifikasi (Settled)</span>
                  <div className="size-8 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                </div>
                <div className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-[#141413] mt-3 tracking-tight truncate">
                  <AnimatedCounter
                    value={metrics.total_settled_revenue}
                    formatter={formatIDR}
                    duration={1000}
                  />
                </div>
                <span className="text-[11px] text-[#8c867b] mt-1 block truncate">
                  Dana masuk rekening terkonfirmasi
                </span>
              </div>

              {/* 2. Pipeline WA */}
              <div className="p-4 sm:p-5 flex flex-col justify-between bg-white hover:bg-[#faf8f5]/60 transition-colors min-w-0">
                <div className="flex items-center justify-between text-xs text-[#706c64] gap-2">
                  <span className="font-medium truncate">Potensi Pipeline WhatsApp</span>
                  <div className="size-8 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] shrink-0">
                    <Clock className="size-4" />
                  </div>
                </div>
                <div className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-[#cc785c] mt-3 tracking-tight truncate">
                  <AnimatedCounter
                    value={metrics.pending_revenue}
                    formatter={formatIDR}
                    duration={1100}
                  />
                </div>
                <span className="text-[11px] text-[#8c867b] mt-1 block truncate">
                  Pesanan menunggu konfirmasi
                </span>
              </div>

              {/* 3. AOV */}
              <div className="p-4 sm:p-5 flex flex-col justify-between bg-white hover:bg-[#faf8f5]/60 transition-colors min-w-0">
                <div className="flex items-center justify-between text-xs text-[#706c64] gap-2">
                  <span className="font-medium truncate">Rata-rata Order (AOV)</span>
                  <div className="size-8 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#141413] shrink-0">
                    <TrendingUp className="size-4" />
                  </div>
                </div>
                <div className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-[#141413] mt-3 tracking-tight truncate">
                  <AnimatedCounter
                    value={metrics.aov}
                    formatter={formatIDR}
                    duration={1200}
                  />
                </div>
                <span className="text-[11px] text-[#8c867b] mt-1 block truncate">
                  Nilai transaksi rata-rata per pembeli
                </span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart
                  data={metrics.weekly_revenue_trends || metrics.revenue_trends}
                  monthlyData={metrics.monthly_revenue_trends}
                />
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

