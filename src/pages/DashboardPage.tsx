import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Clock, CheckCircle2, TrendingUp, ArrowUpRight, ListOrdered } from 'lucide-react'
import type { DashboardMetrics, Order } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { PaymentBreakdown } from '@/components/dashboard/PaymentBreakdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  const storeId = 'store-batik-01'
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
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
  }, [])

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="font-serif text-lg text-muted mt-3">Menghitung analitik finansial toko...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-ink pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted">
                Fintech Command Center
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink tracking-tight mt-1">
              Dashboard Keuangan & Penjualan
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Pantau arus pendapatan riil dari transaksi WhatsApp secara transparan tanpa potongan gateway.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/orders">
              <Button className="h-10 text-xs sm:text-sm">
                <ListOrdered className="size-4" />
                <span>Kelola Pesanan</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 4 Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Settled Revenue */}
          <MetricCard
            label="Total Pendapatan Terverifikasi"
            value={formatIDR(metrics.total_settled_revenue)}
            trend={{ text: '+24.8% bln ini', isPositive: true }}
            subtext="Status: Paid & Fulfilled"
            icon={<DollarSign className="size-5" />}
          />

          {/* Pending Pipeline */}
          <MetricCard
            label="Potensi Pendapatan (Pipeline WA)"
            value={formatIDR(metrics.pending_revenue)}
            trend={{ text: `${metrics.pending_orders_count} pesanan aktif`, isPositive: false }}
            subtext="Menunggu transfer bank"
            icon={<Clock className="size-5 text-status-amber" />}
          />

          {/* Conversion Rate */}
          <MetricCard
            label="Tingkat Konversi WhatsApp"
            value={`${metrics.conversion_rate.toFixed(1)}%`}
            trend={{ text: 'Target: >70%', isPositive: metrics.conversion_rate >= 70 }}
            subtext={`${metrics.paid_orders_count} dari ${metrics.total_checkouts} checkout`}
            icon={<TrendingUp className="size-5 text-status-teal" />}
          />

          {/* Average Order Value (AOV) */}
          <MetricCard
            label="Rata-rata Nilai Pesanan (AOV)"
            value={formatIDR(metrics.aov)}
            subtext="Berdasarkan pesanan berhasil"
            icon={<CheckCircle2 className="size-5" />}
          />
        </div>

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <RevenueChart data={metrics.revenue_trends} />
          </div>
          <div>
            <PaymentBreakdown distribution={metrics.payment_distribution} />
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="mt-8 rounded-xl bg-surface-card border border-hairline overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-hairline flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium tracking-tight text-ink">
                Transaksi Terkini
              </h3>
              <p className="text-xs text-muted mt-0.5">
                5 aktivitas pesanan terbaru dari WhatsApp checkout
              </p>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-active transition-colors"
            >
              <span>Semua Pesanan</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-hairline overflow-x-auto">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-soft transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="size-10 rounded-full bg-canvas border border-hairline flex items-center justify-center font-serif text-sm font-medium text-ink shrink-0">
                    {order.buyer_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{order.buyer_name}</span>
                      <span className="font-mono text-xs text-muted">({order.order_code})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                      <span>{order.payment_method || 'Transfer Bank'}</span>
                      <span>•</span>
                      <span>{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <Badge status={order.status} />
                  <span className="font-serif text-base sm:text-lg font-medium text-ink">
                    {formatIDR(order.total_amount || order.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
