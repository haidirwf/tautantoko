import { useState } from 'react'
import { formatIDR } from '@/lib/utils'

interface RevenueChartProps {
  data: {
    date: string
    settled: number
    pending: number
  }[]
  monthlyData?: {
    date: string
    settled: number
    pending: number
  }[]
  title?: string
  subtitle?: string
}

export function RevenueChart({
  data,
  monthlyData,
  title,
  subtitle,
}: RevenueChartProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const activeData = period === 'weekly' || !monthlyData ? data : monthlyData

  const totalSettled = activeData.reduce((acc, d) => acc + (d.settled || 0), 0)
  const totalPending = activeData.reduce((acc, d) => acc + (d.pending || 0), 0)

  const maxVal = Math.max(
    ...activeData.map((d) => Math.max(d.settled || 0, d.pending || 0)),
    500000
  )

  const displayTitle =
    title ||
    (period === 'weekly'
      ? 'Tren Pendapatan Mingguan'
      : 'Tren Pendapatan Bulanan')

  const displaySubtitle =
    subtitle ||
    (period === 'weekly'
      ? 'Pergerakan omzet 7 hari terakhir dari etalase WhatsApp'
      : 'Performa omzet 6 bulan terakhir dari etalase WhatsApp')

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs text-[#141413] flex flex-col justify-between">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight text-[#141413]">
              {displayTitle}
            </h3>
            {monthlyData && (
              <div className="flex items-center p-0.5 rounded-lg bg-[#faf8f5] border border-[#e8e2d9]">
                <button
                  type="button"
                  onClick={() => {
                    setPeriod('weekly')
                    setHoverIndex(null)
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    period === 'weekly'
                      ? 'bg-white text-[#141413] shadow-2xs border border-[#e8e2d9]/60'
                      : 'text-[#706c64] hover:text-[#141413]'
                  }`}
                >
                  Mingguan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeriod('monthly')
                    setHoverIndex(null)
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    period === 'monthly'
                      ? 'bg-white text-[#141413] shadow-2xs border border-[#e8e2d9]/60'
                      : 'text-[#706c64] hover:text-[#141413]'
                  }`}
                >
                  Bulanan
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-[#706c64] mt-0.5">
            {displaySubtitle}
          </p>
        </div>

        {/* Legend & Summary */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#cc785c] shrink-0" />
            <span className="text-[#706c64] font-medium">
              Selesai: <strong className="text-[#141413] font-mono">{formatIDR(totalSettled)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#e8a55a] shrink-0" />
            <span className="text-[#706c64] font-medium">
              Pending: <strong className="text-[#a8651a] font-mono">{formatIDR(totalPending)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        <div className="h-44 sm:h-48 flex items-end justify-between gap-1.5 sm:gap-4 px-1 sm:px-2">
          {activeData.map((item, idx) => {
            const hasData = item.settled > 0 || item.pending > 0
            const settledHeight = hasData
              ? Math.max((item.settled / maxVal) * 100, item.settled > 0 ? 6 : 0)
              : 3
            const pendingHeight = hasData
              ? Math.max((item.pending / maxVal) * 100, item.pending > 0 ? 6 : 0)
              : 3
            const isHovered = hoverIndex === idx

            return (
              <div
                key={`${period}-${item.date}`}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 px-3 py-1.5 rounded-xl bg-white border border-[#e8e2d9] text-[11px] shadow-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                    <span className="font-semibold text-[#141413] block">{item.date}</span>
                    <span className="text-[#cc785c] font-medium block font-mono">
                      Selesai: {formatIDR(item.settled)}
                    </span>
                    <span className="text-[#a8651a] font-medium block font-mono">
                      Pending: {formatIDR(item.pending)}
                    </span>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="w-full max-w-[32px] flex items-end gap-1 justify-center h-full">
                  {/* Settled Bar */}
                  <div
                    style={{ height: `${settledHeight}%` }}
                    className={`w-1/2 rounded-t-xs bg-[#cc785c] transition-all duration-300 ${
                      isHovered
                        ? 'brightness-110 shadow-xs'
                        : item.settled > 0
                        ? 'opacity-95'
                        : 'opacity-20 bg-[#e8e2d9]'
                    }`}
                  />
                  {/* Pending Bar */}
                  <div
                    style={{ height: `${pendingHeight}%` }}
                    className={`w-1/2 rounded-t-xs bg-[#e8a55a] transition-all duration-300 ${
                      isHovered
                        ? 'brightness-110 shadow-xs'
                        : item.pending > 0
                        ? 'opacity-90'
                        : 'opacity-20 bg-[#e8e2d9]'
                    }`}
                  />
                </div>

                {/* Date Label */}
                <span
                  className={`text-[10px] sm:text-[11px] font-mono mt-3 transition-colors truncate max-w-full text-center ${
                    isHovered ? 'text-[#141413] font-bold' : 'text-[#8c867b]'
                  }`}
                >
                  {item.date}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
